const debug = require('debug')('pwa-buildpack:createServiceWorkerConfig');
const path = require('path');

const ServiceWorkerPlugin = require('../WebpackTools/plugins/ServiceWorkerPlugin');

module.exports = function({
    mode,
    context,
    paths,
    babelConfigPresent,
    hasFlag
}) {
    debug('Creating service worker config');
    const config = {
        mode,
        context,
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
                injectManifestConfig: {
                    include: [/\.js$/],
                    swSrc: './sw.js',
                    swDest: './sw.js'
                }
            })
        ]
    };
    debug('Done creating service worker config.');
    return config;
};
