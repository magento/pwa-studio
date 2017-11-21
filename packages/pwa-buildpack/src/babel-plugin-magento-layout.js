const assert = require('assert');

const nodeProcessed = Symbol('node-was-processed');

/**
 * @param {object} options
 * @param {Map<string, Array<{componentPath: string, withoutChildren?: bool, withoutProps?: bool}>>} options.extensions
 * @param {string | undefined} options.targetProp
 * @param {boolean} options.prod
 */
function babelPluginMageExtensionsFactory(options = {}) {
    const {
        extensions,
        targetProp = 'mid',
        prod = process.env.NODE_ENV === 'production'
    } = options;

    assert(
        typeof targetProp === 'string',
        'targetProp descriptor must be a string'
    );
    assert(
        Object.prototype.toString.call(extensions) === '[object Map]',
        '"extensions" should be a Map'
    );

    return function babelPluginMageExtensions({ types: t }) {
        /**
         * @param {string} elemLocalIdent
         * @param {Array<any>} children
         * @param {Array<any>} attrs
         */
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

        /**
         * @param {string} localIdent
         * @param {string} src
         */
        const buildImportNode = (localIdent, src) => {
            // Example: `import localIdent from 'src';`
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
                    const elementName = openingElement.name.name;
                    const { attributes } = openingElement;

                    const targetPropAttr = attributes.find(
                        attr => attr.name.name === targetProp
                    );

                    // no targetProp prop, bail early
                    if (!targetPropAttr) return;

                    const targetPropWrapper = targetPropAttr.value;
                    assert(
                        t.isStringLiteral(targetPropWrapper),
                        `${
                            targetProp
                        } prop must be a literal string value. Instead it was of type ${
                            targetPropWrapper.type
                        }`
                    );

                    // remove targetProp from the compiled output to prevent unknown prop warnings
                    attributes.splice(attributes.indexOf(targetPropAttr), 1);

                    const currentTargetProp = targetPropWrapper.value;
                    const operations = extensions.get(currentTargetProp);
                    // No extensions registered operations for this targetProp, bail early
                    if (!operations || !operations.length) return;

                    const program = this.file.path;

                    for (const config of operations) {
                        const ident = path.scope.generateUidIdentifier(
                            'Extension'
                        ).name;
                        const wrapperIdent = path.scope.generateUidIdentifier(
                            'ExtensionComponentWrap'
                        ).name;

                        if (!prod) {
                            // Inject import for the Magento extension boundary
                            // in development mode only
                            program.node.body.unshift(
                                buildImportNode(
                                    wrapperIdent,
                                    '@magento/anhinga/dist/ExtensionComponentWrap'
                                )
                            );
                        }

                        program.node.body.unshift(
                            buildImportNode(ident, config.componentPath)
                        );

                        const replacement = buildReplacementNode(
                            ident,
                            config.withoutChildren ? [] : path.node.children,
                            config.withoutProps ? [] : attributes
                        );

                        // Create a JSX prop to pass to the replacement wrapper,
                        // so we can identify at runtime within an error boundary
                        // additional details about the replacement
                        const replacedIDAttr = t.JSXAttribute(
                            t.JSXIdentifier('replacedID'),
                            t.StringLiteral(currentTargetProp)
                        );
                        const replacementLocation = t.JSXAttribute(
                            t.JSXIdentifier('replacedInFile'),
                            t.StringLiteral(
                                this.file.opts.filename || 'unknown'
                            )
                        );
                        const replacedElementName = t.JSXAttribute(
                            t.JSXIdentifier('replacedElementType'),
                            t.StringLiteral(elementName)
                        );

                        // nest the replacement extension component within
                        // our wrapper with an error boundary
                        const replacementWrapper = buildReplacementNode(
                            wrapperIdent,
                            [replacement],
                            [
                                replacedIDAttr,
                                replacementLocation,
                                replacedElementName
                            ]
                        );

                        // Don't include Magento boundary in production builds
                        path.replaceWith(
                            prod ? replacement : replacementWrapper
                        );

                        // Dead code elimination
                        // Can't kill code for DOM elements
                        if (!isCompositeComponent(elementName)) return;

                        const binding = path.scope.getBinding(elementName);
                        // We only kill dead code (for now) when it comes from an import
                        if (binding.kind !== 'module') return;
                        // Import identifier is used in other expressions, can't remove
                        if (binding.references > 1) return;

                        const importDecl = binding.path.parentPath;
                        importDecl.assertImportDeclaration();

                        if (importDecl.node.specifiers.length === 1) {
                            // Only one import specifier, so we can simply remove
                            // the entire ImportDeclaration
                            importDecl.remove();
                        } else {
                            // > 1 import specifier in this declaration, so only
                            // remove the specifier we replaced
                            binding.path.remove();
                        }
                    }
                }
            }
        };
    };
}

function isCompositeComponent(name) {
    const firstCharIsLower = /^[a-z]/.test(name);
    return !firstCharIsLower;
}

module.exports = babelPluginMageExtensionsFactory;
