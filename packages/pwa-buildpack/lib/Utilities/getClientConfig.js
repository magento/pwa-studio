const debug = require('debug')('pwa-buildpack:createClientConfig');
const path = require('path');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const TerserPlugin = require('terser-webpack-plugin');

const PWADevServer = require('../WebpackTools/PWADevServer');
const RootComponentsPlugin = require('../WebpackTools/plugins/RootComponentsPlugin');
const UpwardIncludePlugin = require('../WebpackTools/plugins/UpwardIncludePlugin');
const MagentoResolver = require('../WebpackTools/MagentoResolver');

function isDevServer() {
    return process.argv.find(v => v.includes('webpack-dev-server'));
}

module.exports = async function({
    mode,
    context,
    paths,
    babelConfigPresent,
    hasFlag,
    vendor,
    projectConfig
}) {
    let vendorTest = '[\\/]node_modules[\\/]';

    if (vendor.length > 0) {
        vendorTest += `(${vendor.join('|')})[\\\/]`;
    }

    debug('Creating client config');

    const config = {
        mode,
        context, // Node global for the running script's directory
        entry: {
            client: path.resolve(paths.src, 'index.js')
        },
        output: {
            path: paths.output,
            publicPath: '/',
            filename:
                mode === 'production' ? '[name].[contenthash].js' : '[name].js',
            strictModuleExceptionHandling: true,
            chunkFilename: '[name].[chunkhash].js'
        },
        module: {
            rules: [
                {
                    test: /\.graphql$/,
                    include: [paths.src, ...hasFlag('graphqlQueries')],
                    use: [
                        {
                            loader: 'graphql-tag/loader'
                        }
                    ]
                },
                {
                    test: /\.(mjs|js)$/,
                    include: [paths.src, ...hasFlag('esModules')],
                    sideEffects: false,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                envName: mode,
                                rootMode: babelConfigPresent ? 'root' : 'upward'
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    oneOf: [
                        {
                            test: [paths.src, ...hasFlag('cssModules')],
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
                            include: /node_modules/,
                            use: [
                                'style-loader',
                                {
                                    loader: 'css-loader',
                                    options: {
                                        modules: false
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    test: /\.(jpg|svg|png)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name]-[hash:base58:3].[ext]'
                            }
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
            new RootComponentsPlugin({
                rootComponentsDirs: [
                    ...hasFlag('rootComponents'),
                    context
                ].reduce(
                    (searchPaths, moduleDir) => [
                        ...searchPaths,
                        path.join(moduleDir, 'RootComponents'),
                        path.join(moduleDir, 'src', 'RootComponents'),
                        path.join(moduleDir, 'lib', 'RootComponents')
                    ],
                    []
                ),
                context
            }),
            new webpack.EnvironmentPlugin(projectConfig.env),
            new UpwardIncludePlugin({
                upwardDirs: [...hasFlag('upward'), context]
            }),
            new WebpackAssetsManifest({
                output: 'asset-manifest.json',
                entrypoints: true,
                publicPath: '/',
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
                        if (name.match(/^RootCmp.*\.js$/)) {
                            const filenames = Array.isArray(value)
                                ? value
                                : [value];
                            assets.bundles.prefetch.push(...filenames);
                        }
                        const ext = path.extname(name);
                        const type = ext && ext.replace(/^\./, '');
                        if (type) {
                            if (!assets[type]) {
                                assets[type] = {};
                            }
                            assets[type][path.basename(name, ext)] = value;
                        }
                    });
                }
            })
        ],
        devtool: 'source-map',
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: new RegExp(vendorTest),
                        chunks: 'all'
                    }
                }
            }
        }
    };

    if (mode === 'development') {
        debug('Modifying client config for development environment');
        Object.assign(config.optimization, {
            moduleIds: 'named',
            nodeEnv: 'development',
            minimize: false,
            occurrenceOrder: true,
            usedExports: true,
            concatenateModules: true,
            sideEffects: true
        });
        if (isDevServer()) {
            // Using eval-source-map shows original source (non-transpiled) as
            // well as comments.
            // See https://webpack.js.org/configuration/devtool/
            config.devtool = 'eval-source-map';
            debug('Configuring Dev Server');
            await PWADevServer.configure(
                {
                    graphqlPlayground: true,
                    ...projectConfig.sections(
                        'devServer',
                        'imageService',
                        'customOrigin'
                    ),
                    ...projectConfig.section('magento'),
                    upwardPath: projectConfig.section('upwardJs').upwardPath
                },
                config
            );
        }
    } else if (mode === 'production') {
        let versionBanner = '';
        try {
            versionBanner = projectConfig.section('staging').buildId;
            if (!versionBanner || versionBanner.trim().length === 0) {
                throw new Error('invalid build id');
            }
        } catch (error) {
            try {
                versionBanner = require('child_process')
                    .execSync('git describe --long --always --dirty=-dev')
                    .toString();
            } catch (e) {
                versionBanner = `${
                    require(path.resolve(context, './package.json')).version
                }-[hash]`;
            }
        }

        debug('Modifying client config for production environment');
        config.performance = {
            hints: 'warning'
        };
        config.devtool = false;
        config.optimization = {
            ...config.optimization,
            moduleIds: 'hashed',
            /**
             * This will move the runtime configuration to
             * its own bundle. Since runtime config tends to
             * change on each compile even though the app logic
             * doesn't, if not separated the whole client bundle
             * needs to be downloaded. Separating them will only
             * download runtime bundle and use the cached client code.
             */
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    /**
                     * Creating the vendors bundle. This bundle
                     * will have all the packages that the app
                     * needs to render. Since these dont change
                     * often, it is advantageous to bundle them
                     * separately and cache them on the client.
                     */
                    vendor: {
                        test: new RegExp(vendorTest),
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            },
            minimizer: [
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
                }),
                new webpack.BannerPlugin({
                    banner: `@version ${versionBanner}`
                })
            ]
        };
    } else {
        debug(
            `Unable to verify environment. Cancelling client config creation. Received mode: ${mode}`
        );
        throw Error(`Unsupported environment mode in webpack config: ${mode}`);
    }
    debug('Client config created');
    return config;
};
