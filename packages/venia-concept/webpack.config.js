require('dotenv').config();

const workboxPlugin = require('workbox-webpack-plugin');
const webpack = require('webpack');
const {
    WebpackTools: {
        MagentoRootComponentsPlugin,
        MagentoResolver,
        UpwardPlugin,
        PWADevServer
    }
} = require('@magento/pwa-buildpack');
const path = require('path');

const pkg = require(path.resolve(__dirname, 'package.json'));
const UglifyPlugin = require('uglifyjs-webpack-plugin');
const configureBabel = require('./babel.config.js');

const themePaths = {
    templates: path.resolve(__dirname, 'templates'),
    src: path.resolve(__dirname, 'src'),
    output: path.resolve(__dirname, 'dist')
};

// mark dependencies for vendor bundle
const libs = [
    'apollo-boost',
    'react',
    'react-dom',
    'react-redux',
    'react-router-dom',
    'redux'
];

module.exports = async function(env) {
    const { phase } = env;

    const babelOptions = configureBabel(phase);

    const enableServiceWorkerDebugging =
        Number(process.env.ENABLE_SERVICE_WORKER_DEBUGGING) === 1;

    const serviceWorkerFileName =
        process.env.SERVICE_WORKER_FILE_NAME ||
        pkg.config.serviceWorkerFileName;

    const config = {
        context: __dirname, // Node global for the running script's directory
        entry: {
            client: path.resolve(themePaths.src, 'index.js')
        },
        output: {
            path: themePaths.output,
            publicPath: '/',
            filename: 'js/[name].js',
            chunkFilename: 'js/[name]-[chunkhash].js',
            pathinfo: true
        },
        module: {
            rules: [
                {
                    include: [themePaths.src],
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
        resolve: await MagentoResolver.configure({
            paths: {
                root: __dirname
            }
        }),
        plugins: [
            new MagentoRootComponentsPlugin({ phase }),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(phase),
                // Blank the service worker file name to stop the app from
                // attempting to register a service worker in index.js.
                // Only register a service worker when in production or in the
                // special case of debugging the service worker itself.
                'process.env.SERVICE_WORKER': JSON.stringify(
                    phase === 'production' || enableServiceWorkerDebugging
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
            // TODO: Move to ServiceWorkerPlugin in PWA Buildpack
            new workboxPlugin.InjectManifest({
                swSrc: `./src/sw.js`,
                swDest: `sw.js`
            })
        ]
    };
    if (phase === 'development') {
        config.devtool = 'eval-source-map';

        const devServerConfig = {
            publicPath: config.output.publicPath,
            graphqlPlayground: {
                queryDirs: [path.resolve(themePaths.src, 'queries')]
            }
        };
        const provideHost = !!process.env.MAGENTO_BUILDPACK_PROVIDE_SECURE_HOST;
        if (provideHost) {
            devServerConfig.provideSecureHost = {
                subdomain: process.env.MAGENTO_BUILDPACK_SECURE_HOST_SUBDOMAIN,
                exactDomain:
                    process.env.MAGENTO_BUILDPACK_SECURE_HOST_EXACT_DOMAIN,
                addUniqueHash: !!process.env
                    .MAGENTO_BUILDPACK_SECURE_HOST_ADD_UNIQUE_HASH
            };
        }
        config.devServer = await PWADevServer.configure(devServerConfig);

        // A DevServer generates its own unique output path at startup. It needs
        // to assign the main outputPath to this value as well.

        config.output.publicPath = config.devServer.publicPath;

        config.plugins.push(
            new webpack.NamedChunksPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new UpwardPlugin(
                config.devServer,
                path.resolve(__dirname, 'venia-upward.yml')
            ),
            // TODO: Move to ServiceWorkerPlugin in PWA Buildpack
            new workboxPlugin.InjectManifest({
                swSrc: `./src/sw.js`,
                swDest: `sw.js`
            })
        );
    } else if (phase === 'production') {
        config.performance = {
            hints: 'warning'
        };
        config.entry.vendor = libs;
        config.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor']
            }),
            new UglifyPlugin({
                parallel: true,
                uglifyOptions: {
                    ecma: 8,
                    parse: {
                        ecma: 8
                    },
                    compress: {
                        ecma: 6
                    },
                    output: {
                        ecma: 7,
                        semicolons: false
                    },
                    keep_fnames: true
                }
            })
        );
    } else {
        throw Error(
            `Unsupported environment phase in webpack config: ${phase}`
        );
    }
    return config;
};
