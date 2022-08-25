const TargetableESModule = require('./TargetableESModule');

/**
 * Builds a simple ES module that imports a list of other modules you provide,
 * and then re-exports those modules in order as an array.
 * Useful for building extensible navigation lists, routes, strategies, etc.
 *
 * This class uses {@link https://github.com/magento/pwa-studio/blob/develop/packages/pwa-buildpack/lib/WebpackTools/loaders/export-esm-collection-loader.js|export-esm-collection-loader} to build the source code.
 */
class TargetableESModuleArray extends TargetableESModule {
    constructor(...args) {
        super(...args);
        this._orderedBindings = [];
    }
    /**
     * Adds a module to the end of the array.
     *
     * This also acts as an alias for the `push()` function.
     *
     * @param {string} importString A static import declaration for a module
     *
     * @returns {undefined}
     */
    addImport(importString) {
        return this.push(importString);
    }

    /**
     * Add a module or modules to the end of the array.
     *
     * This also acts as an alias for the `push()` function.
     *
     * @param  {...any} items Static import declaration(s)
     *
     * @returns {undefined}
     */
    add(...items) {
        return this.push(...items);
    }
    /**
     * Add a module or modules to the end of the array.
     *
     * @param {...string} importString - Static import declaration(s)
     *
     * @returns {undefined}
     */
    push(...items) {
        return this._forEachBinding(items, item =>
            this._orderedBindings.push(item)
        );
    }
    /**
     * Add a module or modules to the _beginning_ of the array.
     *
     * @param {...string} importString - Static import declaration(s)
     *
     * @returns {undefined}
     */
    unshift(...items) {
        return this._forEachBinding(items, item =>
            this._orderedBindings.unshift(item)
        );
    }
    _forEachBinding(items, callback) {
        for (const item of items) {
            // Add the import and get its SingleImportSpecifier.
            const generated = super.addImport(item);
            // If it's already been imported, it won't import again,
            // but another reference to it will go into the array.
            callback(generated.binding);
        }
        return this;
    }
    flush() {
        // Consolidate into a single transform request.
        // If the array is large, this improves performance.
        if (this._bindings.size > 0) {
            // Should happen after the imports are added.
            this._queuedTransforms.unshift(
                this._createTransform(
                    'source',
                    '@magento/pwa-buildpack/lib/WebpackTools/loaders/export-esm-collection-loader',
                    {
                        type: 'array',
                        bindings: this._orderedBindings
                    }
                )
            );
        }
        return super.flush();
    }
}

module.exports = TargetableESModuleArray;
