require('dotenv').config();

const webpack = require('webpack');
const {
    WebpackTools: {
        MagentoRootComponentsPlugin,
        ServiceWorkerPlugin,
        DevServerReadyNotifierPlugin,
        MagentoResolver,
        PWADevServer
    }
} = require('@magento/pwa-buildpack');
const path = require('path');

const UglifyPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const configureBabel = require('./babel.config.js');

const dirJoiner = dir => (file = '') => path.resolve(__dirname, dir, file);
const src = dirJoiner('src');
const output = dirJoiner('public');

module.exports = async function() {
    const mode = process.env.WEBPACK_SERVE ? 'development' : 'production';

    const babelOptions = configureBabel(mode);

    const enableServiceWorkerDebugging = Boolean(
        process.env.ENABLE_SERVICE_WORKER_DEBUGGING
    );
    const serviceWorkerFileName =
        process.env.SERVICE_WORKER_FILE_NAME || 'sw.js';

    const config = {
        mode,
        context: __dirname, // Node global for the running script's directory
        entry: {
            client: src('index.js')
        },
        output: {
            path: output(),
            publicPath: '/',
            filename: '[name].js',
            strictModuleExceptionHandling: true,
            chunkFilename: '[name]-[chunkhash].js'
        },
        module: {
            rules: [
                {
                    include: [src()],
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: { ...babelOptions, cacheDirectory: true }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                localIdentName:
                                    '[name]-[local]-[hash:base64:3]',
                                modules: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(jpg|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {}
                        }
                    ]
                }
            ]
        },
        performance: {
            hints: 'warning'
        },
        optimization: {
            noEmitOnErrors: true
        },
        resolve: await MagentoResolver.configure({
            paths: {
                root: __dirname
            }
        }),
        plugins: [
            new MagentoRootComponentsPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(mode),
                // Blank the service worker file name to stop the app from
                // attempting to register a service worker in index.js.
                // Only register a service worker when in production or in the
                // special case of debugging the service worker itself.
                'process.env.SERVICE_WORKER': JSON.stringify(
                    mode === 'production' || enableServiceWorkerDebugging
                        ? serviceWorkerFileName
                        : false
                ),
                /**
                 * TODO: This env var can override the hardcoded product media
                 * path, which we need to hardcode due to
                 * https://github.com/magento/graphql-ce/issues/88
                 */
                'process.env.MAGENTO_BACKEND_PRODUCT_MEDIA_PATH': JSON.stringify(
                    process.env.MAGENTO_BACKEND_PRODUCT_MEDIA_PATH
                )
            }),
            new ServiceWorkerPlugin({
                env: { mode },
                enableServiceWorkerDebugging,
                serviceWorkerFileName
            })
        ]
    };
    if (mode === 'development') {
        config.optimization.splitChunks = {
            chunks: 'async',
            minSize: 30000,
            maxSize: 100000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 2,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        };
        config.devtool = 'source-map';

        config.output.pathinfo = true;

        config.serve = await PWADevServer.configure({
            id: 'venia-webpack4',
            provideUniqueHost: true,
            provideSSLCert: true,
            backendDomain: process.env.MAGENTO_BACKEND_DOMAIN,
            contentPath: config.output.path
        });
        config.plugins.push(
            new DevServerReadyNotifierPlugin(config.serve),
            new HtmlWebpackPlugin({
                meta: {
                    viewport:
                        'width=device-width, initial-scale=1, shrink-to-fit=no'
                },
                chunksSortMode: 'none',
                title: 'Venia',
                alwaysWriteToDisk: true
            }),
            new HtmlWebpackHarddiskPlugin()
        );
    } else if (mode === 'production') {
        config.optimization.splitChunks = {
            chunks: 'all',
            minSize: 30000,
            maxSize: 100000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        };
        config.plugins.push(
            new UglifyPlugin(),
            new HtmlWebpackPlugin({
                meta: {
                    viewport:
                        'width=device-width, initial-scale=1, shrink-to-fit=no'
                },
                title: 'Venia',
                hash: true,
                chunksSortMode: 'none',
                minify: true
            }),
            new FaviconsWebpackPlugin({
                logo: src('components/Header/logo.svg'),
                title: 'Venia'
            })
        );
    } else {
        throw Error(`Unsupported environment mode in webpack config: `);
    }
    return config;
};
