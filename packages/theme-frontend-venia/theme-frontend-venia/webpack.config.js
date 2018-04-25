require('dotenv').config();

const webpack = require('webpack');
const {
    WebpackTools: {
        MagentoRootComponentsPlugin,
        ServiceWorkerPlugin,
        MagentoResolver,
        PWADevServer
    }
} = require('@magento/pwa-buildpack');
const path = require('path');

const UglifyPlugin = require('uglifyjs-webpack-plugin');
const configureBabel = require('./babel.config.js');

const themePaths = {
    src: path.resolve(__dirname, 'src'),
    assets: path.resolve(__dirname, 'web'),
    output: path.resolve(__dirname, 'web/js')
};

// mark dependencies for vendor bundle
const libs = ['react', 'react-dom', 'react-redux', 'react-router-dom', 'redux'];

module.exports = async function(env) {
    const babelOptions = configureBabel(env.phase);

    const config = {
        context: __dirname, // Node global for the running script's directory
        entry: {
            client: path.resolve(themePaths.src, 'index.js')
        },
        output: {
            path: themePaths.output,
            publicPath: process.env.MAGENTO_BACKEND_PUBLIC_PATH,
            filename: '[name].js',
            chunkFilename: '[name]-[chunkhash].js',
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
                    test: /\.svg$/,
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
        resolve: await MagentoResolver.configure({
            paths: {
                root: __dirname
            }
        }),
        plugins: [
            new MagentoRootComponentsPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.EnvironmentPlugin({
                NODE_ENV: env.phase,
                SERVICE_WORKER_FILE_NAME: 'sw.js'
            }),
            new ServiceWorkerPlugin({
                env,
                paths: themePaths,
                enableServiceWorkerDebugging: false,
                serviceWorkerFileName: process.env.SERVICE_WORKER_FILE_NAME
            })
        ]
    };
    if (env.phase === 'development') {
        config.devtool = 'eval-source-map';

        config.devServer = await PWADevServer.configure({
            publicPath: process.env.MAGENTO_BACKEND_PUBLIC_PATH,
            backendDomain: process.env.MAGENTO_BACKEND_DOMAIN,
            serviceWorkerFileName: process.env.SERVICE_WORKER_FILE_NAME,
            paths: themePaths,
            id: 'magento-venia'
        });

        // A DevServer generates its own unique output path at startup. It needs
        // to assign the main outputPath to this value as well.

        config.output.publicPath = config.devServer.publicPath;

        config.plugins.push(
            new webpack.NamedChunksPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin()
        );
    } else if (env.phase === 'production') {
        config.vendor.entry = libs;
        config.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor']
            }),
            new UglifyPlugin()
        );
    } else {
        throw Error(`Unsupported environment phase in webpack config: `);
    }
    return config;
};
