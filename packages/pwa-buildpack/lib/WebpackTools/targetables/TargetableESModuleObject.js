const SingleImportStatement = require('./SingleImportStatement');
const TargetableESModule = require('./TargetableESModule');

/**
 * Builds a simple ES module that imports a list of other modules you provide,
 * and then re-exports those modules as an object with properties matching the
 * imported bindings.
 *
 * Useful for building named lists and associative arrays when making extension points.
 *
 * Uses [export-esm-collection-loader][] to build source code.
 *
 * @example <caption>Export three styles of button in a mapping.</caption>
 *
 * ```js
 * const buttons = targetable.esModuleArray('path/to/buttons.js');
 *
 * buttons.add("import Primary from './path/to/Primary'");
 * buttons.add("import { Button as Simple } from './path/to/simple'");
 * buttons.add("import Secondary from './path/to/Standard'");
 * ```
 *
 * The actual `path/to/buttons.js` file is a placeholder; it just exports an
 * empty object `export default {}`.
 *
 * After the transforms above, `./path/to/button.js` will enter the bundle as:
 *
 * ```js
 * import Primary from './path/to/Primary'");
 * import { Button as Simple } from './path/to/simple'");
 * import { Secondary } from './path/to/Standard'");
 *
 * export default { Primary, Simple, Secondary };
 * ```
 *
 * **Requires an "empty" module that exports either an empty array or an empty
 * object. Without that module, the loader has nothing to "load" and will not
 * execute. Also, without that module, code editors and linters may complain
 * that it's missing.**
 *
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
     * In this type of module, all imports must be exported, so this method
     * gains some additional validation and behavior.
     *
     * @alias TargetableESModuleObject#add
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
    add(...args) {
        args.forEach(arg => this.addImport(arg));
        return this;
    }
}

module.exports = TargetableESModuleObject;
