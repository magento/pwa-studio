const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const webpack = require('webpack');
const {
    WebpackTools: {
        MagentoRootComponentsPlugin,
        ServiceWorkerPlugin,
        DevServerReadyNotifierPlugin,
        MagentoResolver,
        UpwardPlugin,
        CriticalCssPlugin,
        PWADevServer
    }
} = require('@magento/pwa-buildpack');

const TerserPlugin = require('terser-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const configureBabel = require('./babel.config.js');

const themePaths = {
    src: path.resolve(__dirname, 'src'),
    output: path.resolve(__dirname, 'web')
};

const rootComponentsDirs = ['./src/RootComponents/'];

module.exports = async function() {
    const mode = process.env.NODE_ENV || 'development';

    const babelOptions = configureBabel(mode);

    const enableServiceWorkerDebugging = Boolean(
        process.env.ENABLE_SERVICE_WORKER_DEBUGGING
    );
    const serviceWorkerFileName = process.env.SERVICE_WORKER_FILE_NAME;

    const critical = new CriticalCssPlugin({
        mode,
        excludeDirs: rootComponentsDirs
    });

    const config = {
        mode,
        context: __dirname, // Node global for the running script's directory
        entry: {
            client: path.resolve(themePaths.src, 'index.js')
        },
        output: {
            path: themePaths.output,
            publicPath: '/',
            filename: 'js/[name].js',
            strictModuleExceptionHandling: true,
            chunkFilename: 'js/[name]-[chunkhash].js'
        },
        module: {
            rules: [
                {
                    include: [themePaths.src, /node_modules.+\.mjs$/],
                    test: /\.m?js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: { ...babelOptions, cacheDirectory: true }
                        }
                    ]
                },
                {
                    test: /\.mjs$/,
                    type: 'javascript/auto'
                },
                critical.loaders(),
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
            await MagentoRootComponentsPlugin.create({
                rootComponentsDirs,
                context: __dirname
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(mode),
                    // Blank the service worker file name to stop the app from
                    // attempting to register a service worker in index.js.
                    // Only register a service worker when in production or in the
                    // special case of debugging the service worker itself.
                    SERVICE_WORKER: JSON.stringify(
                        mode === 'production' || enableServiceWorkerDebugging
                            ? serviceWorkerFileName
                            : false
                    ),
                    /**
                     * TODO: This env var can override the hardcoded product media
                     * path, which we need to hardcode due to
                     * https://github.com/magento/graphql-ce/issues/88
                     */
                    MAGENTO_BACKEND_PRODUCT_MEDIA_PATH: JSON.stringify(
                        process.env.MAGENTO_BACKEND_PRODUCT_MEDIA_PATH
                    )
                }
            }),
            critical,
            new ServiceWorkerPlugin({
                env: { mode },
                enableServiceWorkerDebugging,
                serviceWorkerFileName,
                paths: themePaths
            }),
            new WebpackAssetsManifest({
                output: '../asset-manifest.json',
                publicPath: true,
                entrypoints: true,
                transform(assets) {
                    const { client } = assets.entrypoints;
                    return {
                        scripts: client.js,
                        criticalCssFile:
                            client.css && client.css[0]
                                ? path.join(themePaths.output, client.css[0])
                                : ''
                    };
                }
            })
        ]
    };
    if (mode === 'development') {
        config.devtool = 'eval-source-map';

        config.devServer = await PWADevServer.configure({
            publicPath: config.output.publicPath,
            serviceWorkerFileName,
            backendDomain: process.env.MAGENTO_BACKEND_DOMAIN,
            paths: themePaths,
            id: 'magento-venia',
            provideSSLCert: true
        });

        config.devServer.stats = {
            assets: false,
            children: false,
            chunks: true,
            chunkGroups: false,
            chunkModules: false,
            chunkOrigins: false,
            errors: true,
            errorDetails: true,
            modules: false,
            warnings: true
        };

        // A DevServer generates its own unique output path at startup. It needs
        // to assign the main outputPath to this value as well.

        config.output.publicPath = config.devServer.publicPath;

        config.plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new DevServerReadyNotifierPlugin(config.devServer),
            new UpwardPlugin(
                config.devServer,
                path.resolve(__dirname, 'venia-upward.yml')
            )
        );
    } else if (mode === 'production') {
        config.performance = {
            hints: 'warning'
        };
        config.plugins.push(new CleanPlugin([themePaths.output]));
        if (!process.env.DEBUG_BEAUTIFY) {
            config.optimization = {
                minimizer: [
                    new TerserPlugin({
                        parallel: true,
                        cache: true,
                        terserOptions: {
                            ecma: 8,
                            compress: {
                                drop_console: true
                            },
                            output: {
                                ecma: 8,
                                semicolons: false
                            }
                        }
                    })
                ]
            };
        }
    } else {
        throw Error(`Unsupported environment mode in webpack config: `);
    }
    return config;
};
