/**
 * Create a Webpack configuration object customized for your project.
 * @module Buildpack/WebpackTools
 */

const debug = require('debug')('pwa-buildpack:MagentoResolver');
const fs = require('fs');
const { CachedInputFileSystem, ResolverFactory } = require('enhanced-resolve');

class MagentoResolverLoggingPlugin {
    constructor(requestContext, log) {
        this.log = requestContext.log = log;
    }
    apply(resolver) {
        const oldResolve = resolver.resolve;
        resolver.resolve = (
            context,
            root,
            request,
            requestContext,
            callback
        ) => {
            const dummyErrorForTrace = new Error(
                `Request for "${request}" failed`
            );
            // format a usable trace if we need it, before the async callbacks
            // make the final stack trace unreadable
            Error.captureStackTrace(
                dummyErrorForTrace,
                MagentoResolver.prototype.resolve
            );
            const dummyTrace = dummyErrorForTrace.stack;
            return oldResolve.call(
                resolver,
                context,
                root,
                request,
                requestContext,
                (err, filepath) => {
                    if (err) {
                        // remove the generic error message from our trace;
                        const friendlyTrace = dummyTrace.slice(
                            dummyTrace.indexOf('\n')
                        );

                        let message = err.message;
                        // get the first line of the original error

                        message = message.slice(
                            0,
                            Math.max(message.indexOf('\n'), message.length - 1)
                        );
                        // now that it's one line, slice off all the "Error: ";
                        message = message.slice(
                            Math.max(message.lastIndexOf('Error: '), 0)
                        );

                        const friendlyError = new Error(
                            message + friendlyTrace
                        );

                        // Now remove the trace it currently has
                        Error.captureStackTrace(friendlyError, MagentoResolver);

                        callback(friendlyError);
                    } else {
                        callback(null, filepath);
                    }
                }
            );
        };
    }
}

/**
 * @typedef {Object} Buildpack/WebpackTools~MagentoResolverOptions
 * @module MagentoResolver
 * @property {boolean} isEE Resolve Magento Commerce (`*.ee.js`) modules instead of Magento Open Source `*.ce.js` modules
 * @property {Object} paths Filesystem paths to resolve from
 */

/**
 * Wrapper for an
 * [enhanced-resolver](https://github.com/webpack/enhanced-resolve/) which can
 * resolve paths according to Webpack rules before the Webpack compiler has
 * been constructed.
 *
 * @class Buildpack/WebpackTools~MagentoResolver
 */
class MagentoResolver {
    /**
     * Legacy method for returning Webpack `resolve` config options as before
     *
     * @deprecated Use `new MagentoResolver(options).config` instead
     * @static
     * @param {Buildpack/WebpackTools~MagentoResolverOptions} options
     * @returns {webpack~WebpackResolveOptions}
     */
    static async configure(options) {
        const resolver = new MagentoResolver(options);
        return resolver.config;
    }
    /**
     *
     * Lazy load an EnhancedResolver instance with a cached file system,
     * configured from our constructor options.
     *
     * @ignore
     * @private
     * @readonly
     */
    get myResolver() {
        if (!this._resolver) {
            this._resolver = ResolverFactory.createResolver({
                // Typical usage will consume the `fs` + `CachedInputFileSystem`, which wraps Node.js `fs` to add caching.
                fileSystem: new CachedInputFileSystem(fs, 4000),
                ...this.config
            });
        }
        return this._resolver;
    }
    /**
     * A MagentoResolver can asynchronously resolve `require` and `import`
     * strings the same way the built PWA will.
     * @param {Buildpack/WebpackTools~MagentoResolverOptions} options
     */
    constructor(options, debugLogger = debug) {
        const { isEE, paths, ...restOptions } = options;
        if (!paths || typeof paths.root !== 'string') {
            throw new Error(
                'new MagentoResolver(options) requires "options.paths.root" to be a string'
            );
        }
        const extensions = [
            '.wasm',
            '.mjs',
            isEE ? '.ee.js' : '.ce.js',
            '.js',
            '.jsx',
            '.json',
            '.graphql'
        ];
        /** @ignore */
        this._root = paths.root;

        /** @type {webpack~WebpackResolveOptions} */
        this.config = {
            alias: {},
            modules: [this._root, 'node_modules'],
            mainFiles: ['index'],
            mainFields: ['esnext', 'es2015', 'module', 'browser', 'main'],
            extensions,
            plugins: [],
            ...restOptions
        };
        /** @ignore */
        this._context = {};
        /** @ignore */
        this._requestContext = {};
        if (debugLogger.enabled) {
            this.config.plugins.push(
                new MagentoResolverLoggingPlugin(
                    this._requestContext,
                    debugLogger
                )
            );
        }
    }
    /**
     * Asynchronously resolve a path the same way Webpack would given the
     * current configuration.
     * @async
     * @param {string} request A module name or path, as in `require('<request>')` or `import foo from '<request>'`.
     * @returns {Promise<string>} Absolute filesystem location.
     */
    async resolve(request) {
        return new Promise((res, rej) => {
            try {
                this.myResolver.resolve(
                    this._context,
                    this._root,
                    request,
                    this._requestContext,
                    (err, filepath) => {
                        if (err) {
                            return rej(err);
                        }
                        res(filepath);
                    }
                );
            } catch (e) {
                rej(e);
            }
        });
    }
}

module.exports = MagentoResolver;
