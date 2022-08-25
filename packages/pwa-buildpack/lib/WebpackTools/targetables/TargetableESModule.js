const SingleImportStatement = require('./SingleImportStatement');
const TargetableModule = require('./TargetableModule');

/**
 * An ECMAScript module that can be changed by a third party.
 *
 * This class presents a convenient API for consumers to add common transforms to ES
 * Modules in a semantic way.
 */
class TargetableESModule extends TargetableModule {
    constructor(...args) {
        super(...args);
        this._imports = new Map();
        this._bindings = new Map();
    }
    /**
     * Adds a static import statement to the module source code, thus importing
     * a new dependency.
     *
     * This method automatically deduplicates attempts to add imports that would override
     * earlier import bindings.
     * If a collision is detected, it renames the binding before inserting it.
     *
     * @param {(string|SingleImportStatement)} statement - A string representing the import statement, or a SingleImportStatement representing it.
     * @returns {SingleImportStatement} An instance of the `SingleImportStatement` class.
     * @memberof TargetableESModule
     */
    addImport(statement) {
        let importStatement =
            statement instanceof SingleImportStatement
                ? statement
                : new SingleImportStatement(statement);
        const existingFromSource = this._imports.get(importStatement.source);
        if (
            existingFromSource &&
            existingFromSource.imported === importStatement.imported
        ) {
            // that's already here, then.
            return existingFromSource;
        }
        if (this._bindings.has(importStatement.binding)) {
            // we have a binding collision. try importing the binding under a
            // different name.
            importStatement = importStatement.changeBinding(
                this.uniqueIdentifier(importStatement.binding)
            );
        }
        this._bindings.set(importStatement.binding, importStatement);
        this._imports.set(importStatement.source, importStatement);
        this.prependSource(importStatement.statement);
        return importStatement;
    }
    /**
     * Generates a unique identifier for a given binding. Not guaranteed safe,
     * but good enough in a pinch.
     *
     * @param {string} binding - The binding to change.
     * @returns {string}
     * @memberof TargetableESModule
     */
    uniqueIdentifier(str) {
        TargetableESModule.increment++;
        return `${str}$${TargetableESModule.increment}`;
    }
    /**
     * Pass exports of this module through a wrapper module.
     *
     * @param {string} [exportName] Name of export to wrap. If not provided, will wrap the default export.
     * @param {string} wrapperModule Package-absolute import path to the wrapper module.
     *
     * @return { this }
     * @chainable
     */
    wrapWithFile(exportNameOrWrapperModule, wrapperModule) {
        const opts = wrapperModule
            ? {
                  exportName: exportNameOrWrapperModule,
                  wrapperModule,
                  defaultExport: false
              }
            : {
                  wrapperModule: exportNameOrWrapperModule,
                  defaultExport: true
              };
        return this.addTransform(
            'source',
            '@magento/pwa-buildpack/lib/WebpackTools/loaders/wrap-esm-loader',
            opts
        );
    }
}

TargetableESModule.increment = 0;

module.exports = TargetableESModule;
