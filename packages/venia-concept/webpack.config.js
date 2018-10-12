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

const pkg = require(path.resolve(__dirname, 'package.json'));
const TerserPlugin = require('terser-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const configureBabel = require('./babel.config.js');

const themePaths = {
    src: path.resolve(__dirname, 'src'),
    output: path.resolve(__dirname, 'dist')
};

const rootComponentsDirs = ['./src/RootComponents/'];

module.exports = async function() {
    const mode = process.env.NODE_ENV || 'development';

    const babelOptions = configureBabel(mode);

    const enableServiceWorkerDebugging =
        Number(process.env.ENABLE_SERVICE_WORKER_DEBUGGING) === 1;

    const serviceWorkerFileName =
        process.env.SERVICE_WORKER_FILE_NAME ||
        pkg.config.serviceWorkerFileName;

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
            filename: 'js/[name]-[hash].js',
            strictModuleExceptionHandling: true,
            chunkFilename: 'js/[name]-[chunkhash].js'
        },
        module: {
            rules: [
                {
                    include: [themePaths.src, /node_modules.+\.mjs$/],
                    test: /\.(mjs|js|graphql)$/,
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
                output: 'asset-manifest.json',
                entrypoints: true,
                transform(assets) {
                    const { client } = assets.entrypoints;
                    return {
                        assets,
                        seedBundles: client.js,
                        criticalCssFile:
                            client.css && client.css[0]
                                ? path.join(themePaths.output, client.css[0])
                                : ''
                    };
                }
            })
        ],
        optimization: {
            runtimeChunk: true
        }
    };
    if (mode === 'development') {
        config.devtool = 'inline-source-map';

        const devServerConfig = {
            publicPath: config.output.publicPath
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
            config.optimization.minimizer = [
                new TerserPlugin({
                    parallel: true,
                    cache: true,
                    terserOptions: {
                        ecma: 8,
                        parse: {
                            ecma: 8
                        },
                        compress: {
                            drop_console: true
                        },
                        output: {
                            ecma: 7,
                            semicolons: false
                        },
                        keep_fnames: true
                    }
                })
            ];
        }
    } else {
        throw Error(`Unsupported environment mode in webpack config: ${mode}`);
    }
    return config;
};
