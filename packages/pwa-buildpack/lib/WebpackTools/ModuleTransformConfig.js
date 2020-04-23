/**
 * @module Buildpack/WebpackTools
 */
const path = require('path');

/**
 * @typedef {Object} TransformRequest
 * Instruction to the Webpack transform loader to pass a given file through a
 * transform function implemented in a given Node module, with an optional set
 * of configuration values that will be passed to the transform function.
 * @prop {string} type - Type of transform. `'babel'` expects a Babel plugin as the `transformModule`. `"source"` expects a Webpack loader.
 * @prop {string} requestor - Name of the file doing the requesting.
 * @prop {string} fileToTransform - Relative path to the file in this module
 *   to be transformed when it is loaded by the compilation.
 * @prop {string} transformModule - The Node module that exports the transform
 *   function to use. Node will resolve this relative to project root.
 * @prop {object} [options] - Config values to send to the transform function.
 *   _Note: Options should be serializable to JSON as Webpack loader options._
 */

/**
 * @typedef {Object.<string, FileExportWrappers>} WrapLoaderConfigSerialized
 * A map of filenames of modules to be wrapped, to FileExportWrappers declaring
 * which exports of those modules will be wrapped with what.
 */

/**
 * Configuration builder for module transforms. Accepts TransformRequests
 * and emits loader config objects for Buildpack's custom transform loaders.
 */
class ModuleTransformConfig {
    constructor(resolver) {
        this._resolver = resolver;
        this._reqs = [];
    }
    _traceableError(msg) {
        const capturedError = new Error(`ModuleTransformConfig: ${msg}`);
        Error.captureStackTrace(capturedError, ModuleTransformConfig);
        return new Error(capturedError.stack);
    }
    /**
     *
     * Add a request to transform a file in the build.
     * @param {TransformRequest} req - Request object
     * @memberof ModuleTransformConfig
     */
    add({ requestor, fileToTransform, transformModule, type, options }) {
        if (typeof requestor !== 'string') {
            throw this._traceableError(
                `Invalid transform request for "${fileToTransform}": requestor module is a required property of a transform request..`
            );
        }
        if (path.isAbsolute(fileToTransform)) {
            throw this._traceableError(
                `Invalid fileToTransform path "${fileToTransform}": Absolute fileToTransform paths are not allowed! This transform request from "${requestor}" must provide a relative path to one of its own files.`
            );
        }
        let absTransformModule;
        try {
            absTransformModule = require.resolve(transformModule);
        } catch (e) {
            absTransformModule = require.resolve(
                path.join(requestor, transformModule)
            );
        }
        // make module-absolute if relative
        const toResolve = fileToTransform.startsWith(requestor)
            ? fileToTransform
            : path.join(requestor, fileToTransform);
        // Capturing in the sync phase so that a resolve failure is traceable.
        const resolveError = this._traceableError(
            `ModuleTransformConfig could not resolve ${toResolve} in order to transform it with ${transformModule}.`
        );
        // push the promise, so we don't run a bunch of resolves all at once
        this._reqs.push(
            this._resolver
                .resolve(toResolve)
                .then(absToTransform => ({
                    requestor,
                    type,
                    fileToTransform: absToTransform,
                    transformModule: absTransformModule,
                    options
                }))
                .catch(() => {
                    throw resolveError;
                })
        );
    }
    /**
     * Resolve paths and emit as JSON.
     */
    async toLoaderOptions() {
        const byType = {
            babel: {},
            source: {}
        };
        // Some reqs may still be outstanding!
        (await Promise.all(this._reqs)).map(req => {
            // Split them up by the transform module to use.
            // Several requests will share one transform instance.
            const { type, transformModule, fileToTransform } = req;
            const xformsForType = byType[type];
            if (!xformsForType) {
                throw new Error(`Unknown transform type "${type}"`);
            }
            const filesForXform =
                xformsForType[transformModule] ||
                (xformsForType[transformModule] = {});
            const requestsForFile =
                filesForXform[fileToTransform] ||
                (filesForXform[fileToTransform] = []);
            requestsForFile.push(req);
        });
        return JSON.parse(JSON.stringify(byType));
    }
}

module.exports = ModuleTransformConfig;
