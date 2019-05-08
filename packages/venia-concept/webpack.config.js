const {
    configureEnvironment,
    WebpackTools: {
        makeMagentoRootComponentsPlugin,
        ServiceWorkerPlugin,
        MagentoResolver,
        UpwardPlugin,
        PWADevServer
    }
} = require('@magento/pwa-buildpack');

const projectConfig = configureEnvironment(__dirname);
const projectEnv = projectConfig.all();

const path = require('path');
const webpack = require('webpack');

const TerserPlugin = require('terser-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');

const themePaths = {
    images: path.resolve(__dirname, 'images'),
    templates: path.resolve(__dirname, 'templates'),
    src: path.resolve(__dirname, 'src'),
    output: path.resolve(__dirname, 'dist')
};

const rootComponentsDirs = ['./src/RootComponents/'];
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

module.exports = async function(env) {
    const mode = (env && env.mode) || process.env.NODE_ENV || 'development';

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
                    test: /\.graphql$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'graphql-tag/loader'
                        }
                    ]
                },
                {
                    include: [themePaths.src, /peregrine\/src\//],
                    test: /\.(mjs|js)$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
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
            await makeMagentoRootComponentsPlugin({
                rootComponentsDirs,
                context: __dirname
            }),
            new webpack.EnvironmentPlugin(projectEnv),
            new ServiceWorkerPlugin({
                mode,
                paths: themePaths,
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
                // venia-upward.yml to use when evaluating app shell templates.
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
                path.resolve(__dirname, projectEnv.upwardJsUpwardPath)
            )
        );
    } else if (mode === 'production') {
        config.performance = {
            hints: 'warning'
        };
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
