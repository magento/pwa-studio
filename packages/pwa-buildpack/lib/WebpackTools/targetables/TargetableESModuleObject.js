const SingleImportStatement = require('./SingleImportStatement');
const TargetableESModule = require('./TargetableESModule');

/**
 * Builds a simple ES module that imports a list of other modules you provide,
 * and then re-exports those modules as an object with properties matching the
 * imported bindings.
 * Useful for building named lists and associative arrays when making extension points.
 *
 * Uses {@link https://github.com/magento/pwa-studio/blob/develop/packages/pwa-buildpack/lib/WebpackTools/loaders/export-esm-collection-loader.js|export-esm-collection-loader} to build source code.
 */
class TargetableESModuleObject extends TargetableESModule {
    constructor(...args) {
        super(...args);
        this._errors = [];
    }
    flush() {
        if (this._bindings.size > 0) {
            this._queuedTransforms.push(
                this._createTransform(
                    'source',
                    '@magento/pwa-buildpack/lib/WebpackTools/loaders/export-esm-collection-loader',
                    {
                        type: 'object',
                        bindings: [...this._bindings.keys()],
                        errors: this._errors
                    }
                )
            );
        }
        return super.flush().reverse();
    }
    /**
     * Adds a module to the object using the `addImport()` method from TargetableESModule.
     * Since, all imports must be exported, this method performs additional validation.
     *
     * @param {string} importString A static import declaration
     *
     * @return { this }
     * @chainable
     */
    addImport(importString) {
        const importStatement = new SingleImportStatement(importString);
        const alreadyBound = this._bindings.get(importStatement.binding);
        if (alreadyBound) {
            this._errors.push(
                `Cannot export "${importStatement.imported}" as "${
                    importStatement.binding
                }" from "${importStatement.source}". Export "${
                    importStatement.binding
                }" was already assigned to "${alreadyBound.imported}" from "${
                    alreadyBound.source
                }".`
            );
        } else {
            super.addImport(importStatement);
        }
        return this;
    }

    /**
     * Adds a module or modules to the object using the `addImport()` function.
     *
     * @param  {...string} args Static import declaration(s)
     *
     * @return { this }
     * @chainable
     */
    add(...args) {
        args.forEach(arg => this.addImport(arg));
        return this;
    }
}

module.exports = TargetableESModuleObject;
