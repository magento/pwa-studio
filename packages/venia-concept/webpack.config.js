const validEnv = require('./validate-environment')(process.env);

const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const {
    WebpackTools: {
        MagentoRootComponentsPlugin,
        ServiceWorkerPlugin,
        MagentoResolver,
        UpwardPlugin,
        PWADevServer
    }
} = require('@magento/pwa-buildpack');
const path = require('path');

const UglifyPlugin = require('uglifyjs-webpack-plugin');
const configureBabel = require('./babel.config.js');

const themePaths = {
    media: path.resolve(__dirname, 'media'),
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

module.exports = async function(passedEnv) {
    const { phase } = passedEnv;

    const babelOptions = configureBabel(phase);

    const enableServiceWorkerDebugging =
        validEnv.ENABLE_SERVICE_WORKER_DEBUGGING;

    const serviceWorkerFileName = validEnv.SERVICE_WORKER_FILE_NAME;

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
                    test: /\.graphql$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'graphql-tag/loader'
                        }
                    ]
                },
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
                )
            }),
            new ServiceWorkerPlugin({
                env: Object.assign({}, validEnv, passedEnv),
                enableServiceWorkerDebugging,
                serviceWorkerFileName,
                paths: themePaths,
                injectManifest: true,
                swPath: {
                    swSrc: './src/sw.js',
                    swDest: 'sw.js'
                }
            }),
            new CopyWebpackPlugin([
                {
                    from: `${themePaths.media}/**/*`,
                    to: themePaths.output,
                    toType: 'dir'
                }
            ])
        ]
    };
    config.devtool = 'eval-source-map';
    if (phase === 'development') {
        const devServerConfig = {
            publicPath: config.output.publicPath,
            graphqlPlayground: {
                queryDirs: [path.resolve(themePaths.src, 'queries')]
            }
        };
        const provideHost = !!validEnv.MAGENTO_BUILDPACK_PROVIDE_SECURE_HOST;
        if (provideHost) {
            devServerConfig.provideSecureHost = {
                subdomain: validEnv.MAGENTO_BUILDPACK_SECURE_HOST_SUBDOMAIN,
                exactDomain:
                    validEnv.MAGENTO_BUILDPACK_SECURE_HOST_EXACT_DOMAIN,
                addUniqueHash: !!validEnv.MAGENTO_BUILDPACK_SECURE_HOST_ADD_UNIQUE_HASH
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
                validEnv,
                path.resolve(__dirname, validEnv.UPWARD_JS_UPWARD_PATH)
            )
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
