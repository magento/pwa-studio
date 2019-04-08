const { promisify } = require('util');
const stat = promisify(require('fs').stat);
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');

const configureEnvironment = require('../Utilities/configureEnvironment');
const makeMagentoRootComponentsPlugin = require('./plugins/makeMagentoRootComponentsPlugin');
const ServiceWorkerPlugin = require('./plugins/ServiceWorkerPlugin');
const UpwardPlugin = require('./plugins/UpwardPlugin');
const PWADevServer = require('./PWADevServer');
const MagentoResolver = require('./MagentoResolver');

/**
 * We need a root directory for the app in order to build all paths relative to
 * that app root. It's not safe to use process.cwd() here because that depends
 * on what directory Node is run in. The project root should be the dir of the
 * webpack.config.js which called this function.
 *
 * There is no safe way to get the path of this function's caller, so instead we
 * expect that the webpack.config.js will do:
 *
 *     configureWebpack(__dirname);
 */
async function validateRoot(appRoot) {
    if (!appRoot) {
        throw new Error(
            'Must provide the root directory of the PWA to as the first parameter to `configureWebpack()`. In webpack.config.js, the recommended code is `configureWebpack(__dirname)`.'
        );
    }
    // If root doesn't exist, an ENOENT will throw here and log to stderr.
    const dirStat = await stat(appRoot);
    if (!dirStat.isDirectory()) {
        throw new Error(
            `Provided application root "${appRoot}" is not a directory.`
        );
    }
}

async function configureWebpack({
    context,
    rootComponentPaths,
    webpackCliEnv
}) {
    await validateRoot(context);

    const projectConfig = configureEnvironment(context);
    const projectEnv = projectConfig.all();

    const paths = {
        src: path.resolve(context, 'src'),
        output: path.resolve(context, 'dist')
    };

    const libs = [
        'apollo-cache-inmemory',
        'apollo-cache-persist',
        'apollo-client',
        'apollo-link-context',
        'apollo-link-http',
        'informed',
        'react',
        'react-apollo',
        'react-dom',
        'react-feather',
        'react-redux',
        'react-router-dom',
        'redux',
        'redux-actions',
        'redux-thunk'
    ];

    const mode =
        (webpackCliEnv && webpackCliEnv.mode) ||
        process.env.NODE_ENV ||
        'development';

    const config = {
        mode,
        context, // Node global for the running script's directory
        entry: {
            client: path.resolve(paths.src, 'index.js')
        },
        output: {
            path: paths.output,
            publicPath: '/',
            filename: 'js/[name].js',
            strictModuleExceptionHandling: true,
            chunkFilename: 'js/[name]-[chunkhash].js'
        },
        module: {
            rules: [
                {
                    test: /\.graphql$/,
                    use: [
                        {
                            loader: 'graphql-tag/loader'
                        }
                    ]
                },
                {
                    include: [paths.src, /\/esm\//],
                    test: /\.(mjs|js)$/,
                    sideEffects: false,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: mode === 'development',
                                envName: mode,
                                rootMode: 'upward'
                            }
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
                root: context
            }
        }),
        plugins: [
            await makeMagentoRootComponentsPlugin({
                rootComponentsDirs: rootComponentPaths,
                context
            }),
            new webpack.EnvironmentPlugin(projectEnv),
            new ServiceWorkerPlugin({
                mode,
                paths: paths,
                injectManifest: true,
                injectManifestConfig: {
                    include: [/\.js$/],
                    swSrc: './src/sw.js',
                    swDest: 'sw.js'
                }
            }),
            new WebpackAssetsManifest({
                output: 'asset-manifest.json',
                entrypoints: true,
                // Add explicit properties to the asset manifest for
                // upward.yml to use when evaluating app shell templates.
                transform(assets) {
                    // All RootComponents go to prefetch, and all client scripts
                    // go to load.
                    assets.bundles = {
                        load: assets.entrypoints.client.js,
                        prefetch: []
                    };
                    Object.entries(assets).forEach(([name, value]) => {
                        if (name.startsWith('RootCmp')) {
                            const filenames = Array.isArray(value)
                                ? value
                                : [value];
                            assets.bundles.prefetch.push(...filenames);
                        }
                    });
                }
            })
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: new RegExp(
                            `[\\\/]node_modules[\\\/](${libs.join('|')})[\\\/]`
                        ),
                        chunks: 'all'
                    }
                }
            }
        }
    };
    if (mode === 'development') {
        config.devtool = 'eval-source-map';
        config.devServer = await PWADevServer.configure({
            publicPath: config.output.publicPath,
            graphqlPlayground: true,
            projectConfig
        });

        // A DevServer generates its own unique output path at startup. It needs
        // to assign the main outputPath to this value as well.

        config.output.publicPath = config.devServer.publicPath;

        config.plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new UpwardPlugin(
                config.devServer,
                process.env,
                path.resolve(context, projectEnv.upwardJsUpwardPath)
            )
        );
    } else if (mode === 'production') {
        config.performance = {
            hints: 'warning'
        };
        config.devtool = 'source-map';
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
        } else {
            config.optimization.minimizer = [
                new TerserPlugin({
                    parallel: true,
                    sourceMap: true,
                    terserOptions: {
                        ecma: 8,
                        parse: {
                            ecma: 8
                        },
                        compress: false,
                        mangle: false,
                        output: {
                            beautify: true,
                            comments: false,
                            ecma: 8,
                            indent_level: 2
                        }
                    }
                })
            ];
        }
    } else {
        throw Error(`Unsupported environment mode in webpack config: ${mode}`);
    }
    return config;
}

module.exports = configureWebpack;
