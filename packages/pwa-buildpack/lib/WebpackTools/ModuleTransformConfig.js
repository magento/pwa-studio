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
 * @typedef {Object.<string, FileExportWrappers>} configSerialized
 * A map of filenames of modules to be wrapped, to FileExportWrappers declaring
 * which exports of those modules will be wrapped with what.
 */

/**
 * Configuration builder for module transforms. Accepts TransformRequests
 * and emits loader config objects for Buildpack's custom transform loaders.
 *
 * @param {MagentoResolver} resolver - Resolver to use when finding real paths of
 * modules requested.
 * @param {string} localProjectName - The name of the PWA project being built, taken from the package.json `name` field.
 */
class ModuleTransformConfig {
    constructor(resolver, localProjectName) {
        this._resolver = resolver;
        this._localProjectName = localProjectName;
        this._reqs = [];
    }
    _isLocal(requestor) {
        return requestor === this._localProjectName;
    }
    _traceableError(msg) {
        const capturedError = new Error(`ModuleTransformConfig: ${msg}`);
        Error.captureStackTrace(capturedError, ModuleTransformConfig);
        return new Error(capturedError.stack);
    }
    /**
     * @private
     * Prevent modules from transforming files from other modules.
     * Preserves encapsulation and maintainability.
     */
    _normalizeFileToTransform(requestor, fileToTransform) {
        // Let the local project change whatever it wants.
        if (this._isLocal(requestor)) {
            return fileToTransform;
        }
        if (typeof requestor !== 'string') {
            throw this._traceableError(
                `Invalid transform request for "${fileToTransform}": requestor module is a required property of a transform request.`
            );
        }
        if (path.isAbsolute(fileToTransform)) {
            throw this._traceableError(
                `Invalid fileToTransform path "${fileToTransform}": Extensions are not allowed to provide absolute fileToTransform paths! This transform request from "${requestor}" must provide a relative path to one of its own files, or to a file within the project's local source code.`
            );
        }
        const belongsToRequestor = fileToTransform.startsWith(requestor);
        const isRelative = fileToTransform.startsWith('.');

        if (!belongsToRequestor && !isRelative) {
            throw this._traceableError(
                `Invalid fileToTransform path "${fileToTransform}": Cannot transform a file provided by another module! This transform request from "${requestor}" must provide a module-relative path to one of its own files, e.g. "${requestor}/some/file", or to a file within the project's local source code, e.g. "./index.css".`
            );
        }
        return fileToTransform;
    }
    /**
     *
     * Add a request to transform a file in the build.
     * @param {TransformRequest} req - Request object
     * @memberof ModuleTransformConfig
     */
    add({ requestor, fileToTransform, transformModule, type, options }) {
        let absTransformModule;
        try {
            absTransformModule = require.resolve(transformModule);
        } catch (e) {
            absTransformModule = require.resolve(
                path.join(requestor, transformModule)
            );
        }

        const toResolve = this._normalizeFileToTransform(
            requestor,
            fileToTransform
        );
        // Capturing in the sync phase so that a resolve failure is traceable.
        const resolveError = this._traceableError(
            `ModuleTransformConfig could not resolve ${toResolve} in order to transform it with ${transformModule}. Resolver options: ${JSON.stringify(
                this._resolver.config,
                null,
                2
            )})`
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
