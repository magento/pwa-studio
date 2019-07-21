// TODO: (p1) write test file and test
const WorkboxPlugin = require('workbox-webpack-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const optionsValidator = require('../../util/options-validator');

// No longer modifiable since v4
const SW_FILENAME = 'sw.js';

class ServiceWorkerPlugin {
    constructor(config) {
        ServiceWorkerPlugin.validateOptions('ServiceWorkerPlugin', config);
        this.config = config;
    }
    applyGenerateSW(compiler) {
        const config = {
            // `globDirectory` and `globPatterns` must match at least 1 file
            // otherwise workbox throws an error
            globDirectory: this.config.paths.output,
            // TODO: (feature) autogenerate glob patterns from asset manifest
            globPatterns: ['**/*.{gif,jpg,png,svg}'],

            // activate the worker as soon as it reaches the waiting phase
            skipWaiting: true,

            // the max scope of a worker is its location
            swDest: SW_FILENAME
        };

        if (this.config.runtimeCacheConfig) {
            config.runtimeCaching = this.config.runtimeCacheConfig;
        }
        new WorkboxPlugin.GenerateSW(config).apply(compiler);
    }

    configureInjectManifest() {
        let injectManifest;
        if (this.config.injectManifestConfig) {
            injectManifest = new WorkboxPlugin.InjectManifest(
                this.config.injectManifestConfig
            );
        } else {
            injectManifest = new WorkboxPlugin.InjectManifest({
                swSrc: this.config.paths.src + '/sw.js',
                swDest: this.config.paths.dest + '/sw.js'
            });
        }
        return injectManifest;
    }

    applyInjectManifest(compiler) {
        this.configureInjectManifest().apply(compiler);
    }

    apply(compiler) {
        if (this.config.mode === 'development') {
            // add a WriteFilePlugin to write out the service worker to the filesystem so it can be served by M2, even though it's under dev
            if (
                this.config.enableServiceWorkerDebugging &&
                !this.config.injectManifest
            ) {
                new WriteFileWebpackPlugin({
                    test: new RegExp(SW_FILENAME + '$'),
                    log: true
                }).apply(compiler);
                this.applyGenerateSW(compiler);
            } else if (
                this.config.enableServiceWorkerDebugging &&
                this.config.injectManifest
            ) {
                this.applyInjectManifest(compiler);
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

    applyWorkbox(compiler) {
        if (this.config.injectManifest) {
            this.applyInjectManifest(compiler);
        } else {
            this.applyGenerateSW(compiler);
        }
    }
}

// Must define methods like this on prototype until Node natively supports
// static class properties.
ServiceWorkerPlugin.validateOptions = optionsValidator('ServiceWorkerPlugin', {
    mode: 'string',
    'paths.output': 'string'
});

module.exports = ServiceWorkerPlugin;
