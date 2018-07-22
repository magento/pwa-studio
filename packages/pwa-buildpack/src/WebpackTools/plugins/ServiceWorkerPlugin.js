// TODO: (p1) write test file and test
const WorkboxPlugin = require('workbox-webpack-plugin');
const optionsValidator = require('../../util/options-validator');

class ServiceWorkerPlugin {
    static validateOptions = optionsValidator('ServiceWorkerPlugin', {
        'env.mode': 'string',
        serviceWorkerFileName: 'string'
    });
    constructor(config) {
        ServiceWorkerPlugin.validateOptions('ServiceWorkerPlugin', config);
        this.config = config;
    }
    applyWorkbox(compiler) {
        const config = {
            // activate the worker as soon as it reaches the waiting phase
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
