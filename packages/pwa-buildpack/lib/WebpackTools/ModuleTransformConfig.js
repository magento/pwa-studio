const path = require('path');

/**
 * @typedef {function(TransformRequest)} addTransform
 * Add a request to transform a file in the build. This function is passed as
 * the first argument to an interceptor of the `transformModules` target.
 *
 * @param {TransformRequest} req - Instruction object for the requested
 * transform, including the transform to apply, the target source code, and
 * other options.
 *
 * @returns null
 */

/** @enum {string} */
const TransformType = {
    /**
     * Process the _source code_ of `fileToTransform` through the
     * `transformModule` as text. When applying a `source` TransformRequest,
     * Buildpack will use the `transformModule` as a [Webpack
     * loader](https://v4.webpack.js.org/api/loaders/), so it must implement
     * that interface. Any Webpack loader can be used as a `transformModule`
     * for `source` TransformRequests.
     *
     * `source` transforms are fast and can run on source code of any language,
     * but they aren't as precise and safe as AST-type transforms when modifying
     * code.
     */
    source: 'source',
    /**
     * Process the _abstract syntax tree_ of the ES module specified by `fileToTransform` through the `transformModule` as a [Babel AST](https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md).
     * When applying a `babel` TransformRequest, Buildpack will use the
     * `transformModule` as a [Babel plugin](https://github.com/jamiebuilds/babel-handbook), so it must implement that interface. Any Babel plugin can be used as a `transformModule` for `babel` TransformRequests.
     *
     * `babel` transforms are powerful and versatile, giving the transformer
     * much more insight into the structure of the source code to modify.
     * However, they are slower than `source` transforms, and they can only work
     * on ES Modules.
     */
    babel: 'babel'
};

/**
 * @typedef {Object} TransformRequest
 * Instruction for configuring Webpack to apply custom transformations to one
 * particular file. The [`configureWebpack()` function]{@link /pwa-buildpack/reference/configure-webpack/}
 * gathers TransformRequests from all interceptors of the `transformModules`
 * target and turns them into a configuration of Webpack [module
 * rules](https://v4.webpack.js.org/configuration/module/#modulerules).
 *
 * @prop {TransformType} type - The type of transformation to apply.
 * @prop {string} requestor - Name of the module making this request. Used for debugging purposes.
 * @prop {string} fileToTransform - Resolvable path to the file to be transformed itself, the same path that you'd use in `import` or `require()`.
 * @prop {string} transformModule - Absolute path to the Node module that will actually be doing the transforming. This path may be resolved using different
 * rules at different times, so it's best for this path to always be absolute.
 * @prop {object} [options] - Config values to send to the transform function.
 *   _Note: Options should be serializable to JSON as Webpack loader options
 *   and/or Babel plugin options.._
 */

/**
 * Configuration builder for module transforms. Accepts TransformRequests
 * and emits loader config objects for Buildpack's custom transform loaders.
 */
class ModuleTransformConfig {
    /** @borrows TransformType as types */
    static get types() {
        return TransformType;
    }
    /**
     * @private
     * @constructs
     * @param {MagentoResolver} resolver - Resolver to use when finding real paths of
     * modules requested.
     * @param {string} localProjectName - The name of the PWA project being built, taken from the package.json `name` field.
     */
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
                `Invalid fileToTransform path "${fileToTransform}": Extensions are not allowed to provide absolute fileToTransform paths! This transform request from "${requestor}" must provide a relative path to one of its own files.`
            );
        }
        // make module-absolute if relative
        return fileToTransform.startsWith(requestor)
            ? fileToTransform
            : path.join(requestor, fileToTransform);
    }
    /**
     * @borrows addTransform as add
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
     *
     * @returns {object} Configuration object
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
