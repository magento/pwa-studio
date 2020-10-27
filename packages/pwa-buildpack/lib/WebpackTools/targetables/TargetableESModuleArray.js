const TargetableESModule = require('./TargetableESModule');

/**
 * Builds a simple ES module that imports a list of other modules you provide,
 * and then re-exports those modules in order as an array.
 *
 * Useful for building extensible navigation lists, routes, strategies, etc.
 *
 * Uses [export-esm-collection-loader][] to build source code.
 *
 * @example <caption>Export PlainHtmlRenderer and PageBuilder in a list.</caption>
 *
 * ```js
 * const renderers = targetable.esModuleArray('@magento/venia-ui/lib/components/RichContent/richContentRenderers.js');
 *
 * renderers.push('import * as PageBuilder from "@magento/pagebuilder"');
 * renderers.push('import * as PlainHtmlRenderer from "@magento/venia-ui/lib/components/RichContent/plainHtmlRenderer"');
 * ```
 *
 * The actual `richContentRenderers.js` file is a placeholder; it just exports an
 * empty array `export default []`.
 *
 * After the transforms above, `richContentRenderers.js` will enter the bundle as:
 *
 * ```js
 * import * as PageBuilder from '@magento/pagebuilder';
 * import * as PlainHtmlRenderer from '@magento/venia-ui/lib/components/RichContent/plainHtmlRenderer';
 *
 * export default [
 *   PageBuilder,
 *   PlainHtmlRenderer
 * ];
 * ```
 * **Requires an "empty" module that exports either an empty array or an empty
 * object. Without that module, the loader has nothing to "load" and will not
 * execute. Also, without that module, code editors and linters may complain
 * that it's missing.**
 *
 */
class TargetableESModuleArray extends TargetableESModule {
    constructor(...args) {
        super(...args);
        this._orderedBindings = [];
    }
    /**
     * In this type of module, all imports must be exported, so this method
     * becomes an alias to TargetableESModuleArray#push.
     *
     * @alias TargetableESModuleArray#push
     */
    addImport(importString) {
        return this.push(importString);
    }
    /** @alias TargetableESModuleArray#push */
    add(...items) {
        return this.push(...items);
    }
    /**
     * Add a module or modules to the end of the array.
     * @param {...string} importString - Static import declaration(s)
     * @returns undefined
     */
    push(...items) {
        return this._forEachBinding(items, item =>
            this._orderedBindings.push(item)
        );
    }
    /**
     * Add a module or modules to the _beginning_ of the array.
     * @param {...string} importString - Static import declaration(s)
     * @returns undefined
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
