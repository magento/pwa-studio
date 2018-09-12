// TODO: (p1) write test file and test
const WorkboxPlugin = require('workbox-webpack-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const optionsValidator = require('../../util/options-validator');

class ServiceWorkerPlugin {
    static validateOptions = optionsValidator('ServiceWorkerPlugin', {
        'env.mode': 'string',
        serviceWorkerFileName: 'string',
        'paths.output': 'string'
    });
    constructor(config) {
        ServiceWorkerPlugin.validateOptions('ServiceWorkerPlugin', config);
        this.config = config;
    }
    applyWorkbox(compiler) {
        const config = {
            // `globDirectory` and `globPatterns` must match at least 1 file
            // otherwise workbox throws an error
            globDirectory: this.config.paths.output,
            // TODO: (feature) autogenerate glob patterns from asset manifest
            globPatterns: ['**/*.{gif,jpg,png,svg}'],

            // activate the worker as soon as it reaches the waiting mode
            skipWaiting: true,

            // the max scope of a worker is its location
            swDest: this.config.serviceWorkerFileName
        };

        if (this.config.runtimeCacheAssetPath) {
            config.runtimeCaching = [
                {
                    urlPattern: new RegExp(this.config.runtimeCacheAssetPath),
                    handler: 'staleWhileRevalidate'
                }
            ];
        }
        new WorkboxPlugin.GenerateSW(config).apply(compiler);
    }
    apply(compiler) {
        if (this.config.env.mode === 'development') {
            // add a WriteFilePlugin to write out the service worker to the filesystem so it can be served by M2, even though it's under dev
            if (this.config.enableServiceWorkerDebugging) {
                new WriteFileWebpackPlugin({
                    test: new RegExp(this.config.serviceWorkerFileName + '$'),
                    log: true
                }).apply(compiler);
                this.applyWorkbox(compiler);
            } else {
                // TODO: (feature) emit a structured { code, severity, resolution } object
                // on Environment that might throw and might not
                console.warn(
                    `Emitting no ServiceWorker in development mode. To enable development mode for ServiceWorkers, pass \`enableServiceWorkerDebugging: true\` to the ServiceWorkerPlugin configuration.`
                );
            }
        } else {
            this.applyWorkbox(compiler);
        }
    }
}
module.exports = ServiceWorkerPlugin;
