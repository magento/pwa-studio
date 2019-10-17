const path = require('path');

const WorkboxPlugin = require('workbox-webpack-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');

const optionsValidator = require('../../util/options-validator');

class ServiceWorkerPlugin {
    constructor(config) {
        ServiceWorkerPlugin.validateOptions('ServiceWorkerPlugin', config);
        this.config = Object.assign(
            {
                // fileName should be explicitly passed as of 4.1.0.
                // this is here for backward compatibility
                fileName: 'sw.js'
            },
            config
        );
    }

    /**
     * This function uses the GenerateSW plugin of the workbox
     * plugin package.
     *
     * @param {*} compiler
     */
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
            swDest: this.config.fileName
        };

        if (this.config.runtimeCacheConfig) {
            config.runtimeCaching = this.config.runtimeCacheConfig;
        }
        new WorkboxPlugin.GenerateSW(config).apply(compiler);
    }

    /**
     * This function uses the InjectManifest plugin of the Workbox
     * plugin package to create the service worker. This function
     * will use the manifest config if provided or use a default.
     *
     * @param {*} compiler
     */
    applyInjectManifest(compiler) {
        const { fileName, injectManifestConfig, paths } = this.config;
        let injectManifest;
        if (injectManifestConfig) {
            injectManifest = new WorkboxPlugin.InjectManifest(
                injectManifestConfig
            );
        } else {
            injectManifest = new WorkboxPlugin.InjectManifest({
                swSrc: path.resolve(paths.src, fileName),
                swDest: path.resolve(paths.output, fileName)
            });
        }
        injectManifest.apply(compiler);
    }

    /**
     * Entry point for a webpack plugin.
     *
     * @param {*} compiler
     */
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

    /**
     * This function takes care of creating the service worker file.
     * This function handles the case of production environment or
     * development environment with enableServiceWorkerDebugging set
     * to true.
     *
     * @param {*} compiler
     */
    applyWorkbox(compiler) {
        const {
            fileName,
            injectManifest,
            enableServiceWorkerDebugging
        } = this.config;
        if (injectManifest) {
            this.applyInjectManifest(compiler);
        } else {
            if (enableServiceWorkerDebugging) {
                new WriteFileWebpackPlugin({
                    test: new RegExp(fileName + '$'),
                    log: true
                }).apply(compiler);
            }
            this.applyGenerateSW(compiler);
        }
    }
}

/**
 * validateOptions is a validator function that runs the
 * provided options though its validator logic. If the options
 * do not pass the validation logic, it throws BuildpackValidationError.
 */
ServiceWorkerPlugin.validateOptions = optionsValidator('ServiceWorkerPlugin', {
    mode: 'string',
    'paths.output': 'string'
});

module.exports = ServiceWorkerPlugin;
