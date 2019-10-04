const WorkboxPlugin = require('workbox-webpack-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');

const optionsValidator = require('../../util/options-validator');

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

    applyInjectManifest(compiler) {
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
        injectManifest.apply(compiler);
    }

    apply(compiler) {
        const { enableServiceWorkerDebugging, mode } = this.config;
        compiler.hooks.afterEmit.tap('ServiceWorkerPlugin', () => {
            if (mode === 'development' && !enableServiceWorkerDebugging) {
                console.warn('Emitting no ServiceWorker in development mode.');
            } else {
                this.applyWorkbox(compiler);
            }
        });
    }

    applyWorkbox(compiler) {
        const { injectManifest, enableServiceWorkerDebugging } = this.config;
        if (injectManifest) {
            this.applyInjectManifest(compiler);
        } else {
            if (enableServiceWorkerDebugging) {
                new WriteFileWebpackPlugin({
                    test: new RegExp(SW_FILENAME + '$'),
                    log: true
                }).apply(compiler);
            }
            this.applyGenerateSW(compiler);
        }
    }
}

ServiceWorkerPlugin.validateOptions = optionsValidator('ServiceWorkerPlugin', {
    mode: 'string',
    'paths.output': 'string'
});

module.exports = ServiceWorkerPlugin;
