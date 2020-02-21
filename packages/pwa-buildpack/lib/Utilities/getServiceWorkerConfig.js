const debug = require('debug')('pwa-buildpack:createServiceWorkerConfig');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const ServiceWorkerPlugin = require('../WebpackTools/plugins/ServiceWorkerPlugin');

module.exports = function({
    mode,
    context,
    paths,
    babelConfigPresent,
    hasFlag,
    projectConfig,
    stats
}) {
    debug('Creating service worker config');
    const config = {
        mode,
        context,
        stats,
        entry: {
            sw: path.resolve(paths.src, 'ServiceWorker/sw.js')
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
                }
            ]
        },
        plugins: [
            new ServiceWorkerPlugin({
                mode,
                paths,
                injectManifest: true,
                enableServiceWorkerDebugging: !!projectConfig.section(
                    'devServer'
                ).serviceWorkerEnabled,
                injectManifestConfig: {
                    include: [/\.js$/],
                    swSrc: './sw.js',
                    swDest: './sw.js'
                }
            })
        ],
        optimization: {
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
                })
            ]
        }
    };
    debug('Done creating service worker config.');
    return config;
};
