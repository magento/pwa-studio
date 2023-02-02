/**
 * Create a Webpack configuration object customized for your project.
 * @module Buildpack/WebpackTools
 */

const fs = require('fs');
const { CachedInputFileSystem, ResolverFactory } = require('enhanced-resolve');

/**
 * @typedef {Object} Buildpack/WebpackTools~MagentoResolverOptions
 * @module MagentoResolver
 * @property {boolean} isAC Resolve Adobe Commerce (`*.ac.js` or `*.ee.js`) modules instead of Magento Open Source (`*.mos.js` or `*.ce.js`) modules
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
    constructor(options) {
        const { isAC, paths, ...restOptions } = options;
        if (!paths || typeof paths.root !== 'string') {
            throw new Error(
                'new MagentoResolver(options) requires "options.paths.root" to be a string'
            );
        }

        const versionExtensions = isAC
            ? ['.ac.js', '.ee.js']
            : ['.mos.js', '.ce.js'];

        const extensions = [
            '.wasm',
            '.mjs',
            ...versionExtensions,
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
            ...restOptions
        };
        /** @ignore */
        this._context = {};
        /** @ignore */
        this._requestContext = {};
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
