/**
 * @module Buildpack/WebpackTools
 */
const debug = require('debug')('pwa-buildpack:createClientConfig');
const path = require('path');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const TerserPlugin = require('terser-webpack-plugin');

const getModuleRules = require('./getModuleRules');
const getResolveLoader = require('./getResolveLoader');

const RootComponentsPlugin = require('../plugins/RootComponentsPlugin');
const ServiceWorkerPlugin = require('../plugins/ServiceWorkerPlugin');
const UpwardIncludePlugin = require('../plugins/UpwardIncludePlugin');
const LocalizationPlugin = require('../plugins/LocalizationPlugin');

const VirtualModulesPlugin = require('webpack-virtual-modules');

function isDevServer() {
    return process.argv.find(v => v.includes('webpack-dev-server'));
}

/**
 * Create a Webpack configuration object for the browser bundle.
 *
 * @param {Buildpack/WebpackTools~WebpackConfigHelper} opts
 * @returns {Object} A Webpack configuration for the main app.
 */
async function getClientConfig(opts) {
    const {
        mode,
        context,
        paths,
        hasFlag,
        vendor,
        projectConfig,
        stats,
        resolver,
        bus
    } = opts;

    let vendorTest = '[\\/]node_modules[\\/]';

    if (vendor.length > 0) {
        vendorTest += `(${vendor.join('|')})[\\\/]`;
    }

    debug('Creating client config');

    // Create an instance of virtual modules enabling any plugin to create new virtual modules
    const virtualModules = new VirtualModulesPlugin();

    const config = {
        mode,
        context, // Node global for the running script's directory
        stats,
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
            rules: await getModuleRules(opts)
        },
        name: 'client-config',
        resolve: resolver.config,
        resolveLoader: getResolveLoader(),
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
                bus,
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
            }),
            new ServiceWorkerPlugin({
                mode,
                paths,
                injectManifest: true,
                enableServiceWorkerDebugging: !!projectConfig.section(
                    'devServer'
                ).serviceWorkerEnabled,
                injectManifestConfig: {
                    include: [/\.(?:css|js|html|svg)$/],
                    swSrc: './src/ServiceWorker/sw.js',
                    swDest: './sw.js'
                }
            }),
            new LocalizationPlugin({
                virtualModules,
                context,
                dirs: [...hasFlag('i18n'), context] // Directories to search for i18n/*.json files
            }),
            virtualModules
        ],
        devtool: 'source-map',
        optimization: {
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
            const PWADevServer = require('../PWADevServer');
            await PWADevServer.configure(
                {
                    graphqlPlayground: true,
                    ...projectConfig.sections(
                        'devServer',
                        'imageOptimizing',
                        'imageService',
                        'customOrigin'
                    ),
                    upwardPath: projectConfig.section('upwardJs').upwardPath
                },
                config
            );
        }
    } else if (mode === 'production') {
        const packageJson = require(path.resolve(context, './package.json'));
        const packageRegex = /^@magento|^@apollo/;
        const pwaStudioVersions = {
            'pwa-studio': packageJson.version,
            ...Object.fromEntries(
                Object.entries(packageJson.dependencies || {}).filter(
                    ([packageKey]) => packageRegex.test(packageKey)
                )
            ),
            ...Object.fromEntries(
                Object.entries(packageJson.devDependencies || {}).filter(
                    ([packageKey]) => packageRegex.test(packageKey)
                )
            )
        };

        try {
            let buildId = projectConfig.section('staging').buildId;
            buildId = buildId ? buildId.trim() : false;

            if (buildId && buildId.length > 0) {
                pwaStudioVersions['build-id'] = buildId;
            }
        } catch {
            // Continue version banner
        }

        const versionBanner = Object.entries(pwaStudioVersions)
            .sort(([packageKeyOne], [packageKeyTwo]) => {
                return -1 * packageKeyOne.localeCompare(packageKeyTwo);
            })
            .map(([packageKey, version]) => `${packageKey}: ${version}`)
            .join(', ');

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
}

module.exports = getClientConfig;
