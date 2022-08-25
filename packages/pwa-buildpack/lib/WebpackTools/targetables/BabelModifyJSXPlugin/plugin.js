const JSXModifier = require('./JSXModifier');

function BabelModifyJsxPlugin(babel) {
    return {
        visitor: {
            /**
             * Use the outermost Program node as a before/after. Babel's "pre"
             * and "post" methods don't give us the state object we want.
             */
            Program: {
                enter(_, state) {
                    /**
                     * Get the plugin config for this file out of the
                     * ModuleTransformConfig-provided global config object.
                     */
                    const { opts, filename } = this;
                    const requests = opts.requestsByFile[filename];
                    /**
                     * JSXModifier is gonna do most of the work.
                     */
                    state.modifyingJSX = new JSXModifier(requests, babel, this);
                },
                /**
                 * Any cleanup goes here. Right now, that's just adding build
                 * warnings about operations that never matched a JSX node.
                 */
                exit(_, { modifyingJSX }) {
                    modifyingJSX.warnUnmatchedOperations();
                }
            },
            /**
             * The matching process uses the element name and attributes. Those
             * are on the opening tag, not the whole JSXElement. Operations
             * will get the whole JSXElement if they need to, using
             * `parentPath`.
             */
            JSXOpeningElement: {
                enter(openingPath, { modifyingJSX }) {
                    modifyingJSX.runMatchingOperations(openingPath);
                }
            }
        }
    };
}

module.exports = BabelModifyJsxPlugin;
