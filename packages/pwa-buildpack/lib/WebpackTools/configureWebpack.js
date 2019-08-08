const { promisify } = require('util');
const stat = promisify(require('fs').stat);
const path = require('path');
const webpack = require('webpack');
const pkgDir = require('pkg-dir');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');

const loadEnvironment = require('../Utilities/loadEnvironment');
const RootComponentsPlugin = require('./plugins/RootComponentsPlugin');
const ServiceWorkerPlugin = require('./plugins/ServiceWorkerPlugin');
const UpwardIncludePlugin = require('./plugins/UpwardIncludePlugin');
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
            'Must provide the root directory of the PWA as the first parameter to `configureWebpack()`. In webpack.config.js, the recommended code is `configureWebpack(__dirname)`.'
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

async function checkForBabelConfig(appRoot) {
    try {
        await stat(path.resolve(appRoot, 'babel.config.js'));
        return true;
    } catch (e) {
        return false;
    }
}

function getMode(cliEnv = {}, projectConfig) {
    if (cliEnv.mode) {
        return cliEnv.mode;
    }
    if (projectConfig.isProd) {
        return 'production';
    }
    return 'development';
}

function isDevServer() {
    return process.argv.find(v => v.includes('webpack-dev-server'));
}

async function configureWebpack({ context, vendor = [], special = {}, env }) {
    await validateRoot(context);

    const babelConfigPresent = await checkForBabelConfig(context);

    const projectConfig = loadEnvironment(context);

    const paths = {
        src: path.resolve(context, 'src'),
        output: path.resolve(context, 'dist')
    };

    const features = await Promise.all(
        Object.entries(special).map(async ([packageName, flags]) => [
            await pkgDir(path.dirname(require.resolve(packageName))),
            flags
        ])
    );

    const hasFlag = flag =>
        features.reduce(
            (hasIt, [packagePath, flags]) =>
                flags[flag] ? [...hasIt, packagePath] : hasIt,
            []
        );

    const mode = getMode(env, projectConfig);

    const config = {
        mode,
        context, // Node global for the running script's directory
        entry: {
            client: path.resolve(paths.src, 'index.js')
        },
        output: {
            path: paths.output,
            publicPath: '/',
            filename: '[name].js',
            strictModuleExceptionHandling: true,
            chunkFilename: '[name]-[chunkhash].js'
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
                    test: /\.(jpg|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name]-[hash:base58:3].[ext]',
                                outputPath: 'static',
                                publicPath: '/static'
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
            new ServiceWorkerPlugin({
                mode,
                paths,
                injectManifest: true,
                injectManifestConfig: {
                    include: [/\.js$/],
                    swSrc: './src/sw.js',
                    swDest: './sw.js'
                }
            }),
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
        devtool: 'source-map'
    };
    let vendorTest = '[\\/]node_modules[\\/]';
    if (vendor.length > 0) {
        vendorTest += `(${vendor.join('|')})[\\\/]`;
    }
    config.optimization = {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: new RegExp(vendorTest),
                    chunks: 'all'
                }
            }
        }
    };
    if (mode === 'development') {
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
            config.devtool = 'cheap-source-map';

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
        config.performance = {
            hints: 'warning'
        };
        config.devtool = false;
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
        throw Error(`Unsupported environment mode in webpack config: ${mode}`);
    }
    return config;
}

module.exports = configureWebpack;
