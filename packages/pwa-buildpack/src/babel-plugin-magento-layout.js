const assert = require('assert');

const nodeProcessed = Symbol('node-was-processed');

/**
 * @param {object} options
 * @param {Map<string, Array<{componentPath: string, withoutChildren?: bool, withoutProps?: bool}>>} options.extensions
 * @param {string | undefined} options.mageID
 */
function babelPluginMageExtensionsFactory(options = {}) {
    const { extensions, mageID = 'mageID' } = options;
    assert(typeof mageID === 'string', 'mageID descriptor must be a string');
    assert(
        Object.prototype.toString.call(extensions) === '[object Map]',
        '"extensions" should be a Map'
    );

    return function babelPluginMageExtensions({ types: t }) {
        const buildReplacementNode = (elemLocalIdent, children, attrs = []) => {
            return t.JSXElement(
                t.JSXOpeningElement(
                    t.JSXIdentifier(elemLocalIdent),
                    attrs,
                    false
                ),
                t.JSXClosingElement(t.JSXIdentifier(elemLocalIdent)),
                children
            );
        };

        const buildImportNode = (localIdent, src) => {
            return t.ImportDeclaration(
                [t.ImportDefaultSpecifier(t.Identifier(localIdent))],
                t.StringLiteral(src)
            );
        };

        return {
            visitor: {
                JSXElement(path) {
                    // If we've already seen this node in the plugin, bail. This is to prevent
                    // infinite loops that can happen when you use `insertAfter` or `replaceWith` on a path,
                    // and insert a new element that is of the same type as the visitor you're in.
                    // Example: http://astexplorer.net/#/gist/7a4ca0d5cb7284c3ec0c7123cc022124/02076b83f09eee06d3dc6cc763462ec7e554755a
                    if (path.node[nodeProcessed]) return;
                    // Leave a marker on the element to indicate this plugin has processed it
                    path.node[nodeProcessed] = true;

                    const { openingElement } = path.node;
                    const { attributes } = openingElement;
                    const elementName = openingElement.name.name;

                    const mageIDAttr = attributes.find(
                        attr => attr.name.name === mageID
                    );

                    // no mageID prop, bail early
                    if (!mageIDAttr) return;

                    const mageIDWrapper = mageIDAttr.value;
                    assert(
                        t.isStringLiteral(mageIDWrapper),
                        `${
                            mageID
                        } prop must be a literal string value. Instead it was of type ${
                            mageIDWrapper.type
                        }`
                    );

                    // remove mageID from the compiled output to prevent unknown prop warnings
                    attributes.splice(attributes.indexOf(mageIDAttr), 1);

                    const currentMageID = mageIDWrapper.value;
                    const operations = extensions.get(currentMageID);
                    // No extensions registered operations for this mageID, bail early
                    if (!operations || !operations.length) return;

                    const program = this.file.path;

                    for (const config of operations) {
                        const ident = path.scope.generateUidIdentifier(
                            'Extension'
                        ).name;
                        program.node.body.unshift(
                            buildImportNode(ident, config.componentPath)
                        );
                        const replacement = buildReplacementNode(
                            ident,
                            config.withoutChildren ? [] : path.node.children,
                            config.withoutProps ? [] : attributes
                        );
                        path.replaceWith(replacement);
                    }
                }
            }
        };
    };
}

module.exports = babelPluginMageExtensionsFactory;
