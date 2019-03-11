const validateConfig = require('./validateConfig');
const { addDefault } = require('@babel/helper-module-imports');

const noop = () => {};
module.exports = babelPluginMagentoLayout;

function babelPluginMagentoLayout({ types: t }) {
    // Babel 6 only let's you read plugin options inside visitors,
    // so we can't warn about an invalid config until the first file is hit.
    // TODO: In Babel 7, use config passed in when plugin is first created. For now,
    // this hacky flag is kept in a closure to prevent us from doing config validation
    // on every file transformed
    let validationRan;

    return {
        visitor: {
            Program: {
                // Our plugin could be (and frequently is) running along with other Babel
                // plugins, including the JSX transform. Babel's visitor merging behavior
                // will make this plugin susceptible to hard-to-debug plugin/preset ordering
                // issues. To avoid this entirely, we don't start our work until the depth-first
                // traversal of the AST completes. On Program:exit, we can safely start our work
                exit(programPath, state) {
                    // Babel 6 only let's you read plugin options inside visitors,
                    // so we can't warn about an invalid config until the first file is hit.
                    // TODO: In Babel 7, use config passed in when plugin is first created
                    const {
                        config,
                        prod = false,
                        onWarning = noop,
                        onError = noop
                    } = state.opts;

                    if (!validationRan) {
                        validationRan = true;
                        if (typeof prod !== 'boolean') {
                            onError(
                                `Expected "prod" to be a boolean, but received "${typeof prod}"`
                            );
                        }
                        if (typeof config !== 'object') {
                            onError(
                                `Expected "config" to be an object, but received "${typeof config}"`
                            );
                        }

                        const { passed, error } = validateConfig(config);
                        if (!passed) {
                            // Warn about invalid config, but let the compilation
                            // keep going
                            onWarning(error);
                        }
                    }

                    // We need to find any identifiers in scope that could be used to call
                    // React's `createElement` function.
                    const reactModuleImports = identifiersInScopeFromModule(
                        programPath,
                        /^react$/
                    );
                    const {
                        reactIdentifier,
                        createElementIdentifier
                    } = reactModuleImports.reduce((acc, importData) => {
                        if (importData.bindingName === 'default') {
                            acc.reactIdentifier = importData.local;
                        }
                        if (importData.bindingName === 'createElement') {
                            acc.createElementIdentifier = importData.local;
                        }
                        return acc;
                    }, {});

                    // No element creation in this file, so we bail
                    if (!(reactIdentifier || createElementIdentifier)) {
                        return;
                    }

                    // Start the transformation traversal
                    programPath.traverse({
                        CallExpression(path) {
                            const isCECall = isCreateElementCall(
                                path,
                                reactIdentifier,
                                createElementIdentifier
                            );
                            if (!isCECall) return;

                            const [element] = path.get('arguments');
                            const dataMIDPropNode = getProp(path, 'data-mid');
                            if (!dataMIDPropNode) return;

                            const { value: dataMID, type } = dataMIDPropNode;
                            if (type !== 'StringLiteral') {
                                onWarning(
                                    'Expected "data-mid" to be a literal string, ' +
                                        `but instead found a value of type "${type}"`
                                );
                            }

                            if (!t.isStringLiteral(element)) {
                                onWarning(
                                    '"data-mid" found on a Composite Component.' +
                                        'Only DOM elements(div/span/etc) can be a Layout Container'
                                );
                            }

                            const operations = config[dataMID];
                            // No operations were registered for this Container
                            if (!(operations && operations.length)) {
                                return;
                            }

                            new ContainerOperationsProcessor({
                                types: t,
                                operations,
                                containerPath: path,
                                containerMID: dataMID,
                                program: programPath,
                                reactIdentifier,
                                createElementIdentifier,
                                onWarning,
                                onError
                            }).execute();
                        }
                    });
                }
            }
        }
    };
}

class ContainerOperationsProcessor {
    constructor({
        types,
        operations,
        containerPath,
        containerMID,
        program,
        reactIdentifier,
        createElementIdentifier,
        onWarning,
        onError
    }) {
        Object.assign(this, {
            types,
            operations,
            containerPath,
            containerMID,
            program,
            reactIdentifier,
            createElementIdentifier,
            onWarning,
            onError
        });
        this.step = 0;
        this.cachedContainerChildIdent = null;
    }

    get currentOperation() {
        return this.operations[this.step];
    }

    get isDone() {
        return this.step + 1 > this.operations.length;
    }

    execute() {
        while (!this.isDone) {
            this[this.currentOperation.operation]();
            ++this.step;
        }
    }

    /**
     * Determine the local identifier for Peregrine's `ContainerChild` component.
     * This method makes the assumption that the module specifier for a Peregrine
     * import will always be `@magento/peregrine`. Can make this configurable in the
     * future if necessary.
     * @returns {string|null}
     */
    getContainerChildIdentifier() {
        const { cachedContainerChildIdent } = this;
        if (cachedContainerChildIdent) return cachedContainerChildIdent;

        const { program } = this;
        const containerChildIdent = identifiersInScopeFromModule(
            program,
            /^@magento\/peregrine$/
        ).find(({ bindingName }) => bindingName === 'ContainerChild');

        if (containerChildIdent) {
            this.cachedContainerChildIdent = containerChildIdent.local;
        }

        return this.cachedContainerChildIdent;
    }

    /**
     * Given the identifier for a <ContainerChild />, will return a Babel path
     * for the matching child in the currently-targeted Container
     * @param {string} name
     * @returns {Path|null}
     */
    findContainerChildByName(targetChildID) {
        const {
            containerPath,
            reactIdentifier,
            createElementIdentifier
        } = this;
        const containerChildIdent = this.getContainerChildIdentifier();

        const [, , ...children] = this.containerPath.get('arguments');
        const matchingChild = children.find(child => {
            // TODO: warn when child is not a ContainerChild
            const isElement =
                child.isCallExpression() &&
                isCreateElementCall(
                    containerPath,
                    reactIdentifier,
                    createElementIdentifier
                );
            if (!isElement) return;

            // Verify the child is a Peregrine ContainerChild
            const [elementIdentifier] = child.node.arguments;
            if (elementIdentifier.name !== containerChildIdent) return;

            const idPropNode = getProp(child, 'id');
            return idPropNode && idPropNode.value === targetChildID;
        });
        return matchingChild || null;
    }

    /**
     * Given an element name, and optional props and children,
     * returns a Node representing a call to React's createElement
     * @param {string} element Identifier for Composite Component or DOM Element
     * @param {object=} props
     * @returns {Node}
     */
    buildCreateElementCall(element, props) {
        const { types: t, reactIdentifier, createElementIdentifier } = this;
        const callee = createElementIdentifier
            ? t.identifier(createElementIdentifier)
            : t.memberExpression(
                  t.identifier(reactIdentifier),
                  t.identifier('createElement')
              );
        const elementNode = !t.react.isCompatTag(element)
            ? t.identifier(element) // Composite Component
            : t.stringLiteral(element); // DOM Element
        return t.callExpression(callee, [
            elementNode,
            props || t.nullLiteral()
        ]);
    }

    /**
     * Within a CallExpression, inserts a new expression AST node
     * before or after the specified argument
     * @param {'before'|'after'} position
     * @param {Path} Babel path for a CallExpression
     * @param {Node} targetArg AST Node in the arguments array to insert adjacent to
     * @param {Node} exprNode An AST node representing any expression
     */
    insertAdjacentArgumentsNode(position, callPath, targetArg, exprNode) {
        const { arguments: args } = callPath.node;
        const targetArgIndex = args.indexOf(targetArg);
        const targetIndex =
            position === 'before' ? targetArgIndex : targetArgIndex + 1;
        args.splice(targetIndex, 0, exprNode);
    }

    /**
     * Used for insertBefore/insertAfter operations. Given a before
     * or after position, locates the target ContainerChild in the
     * current Container, and inserts an import declaration for an
     * extension, along with the element in the proper position
     * @param {'before'|'after'} position
     */
    insertElementAdjacentToChild(position) {
        const { containerPath, currentOperation, onWarning } = this;
        const { targetChild, componentPath } = currentOperation;
        const targetChildPath = this.findContainerChildByName(targetChild);
        if (!targetChildPath) {
            onWarning(
                `Attempted to inject a PWA Studio extension, but specified targetChild was not found\n` +
                    `operation: ${currentOperation.operation}\n` +
                    `targetContainer: ${currentOperation.targetContainer}\n` +
                    `targetChild: ${currentOperation.targetChild}`
            );
            return;
        }
        const componentIdent = addDefault(targetChildPath, componentPath, {
            nameHint: 'Extension'
        }).name;
        // TODO: extensionNode needs to be wrapped in a new ContainerChild,
        // and an error boundary
        const extensionNode = this.buildCreateElementCall(componentIdent);
        this.insertAdjacentArgumentsNode(
            position,
            containerPath,
            targetChildPath.node,
            extensionNode
        );
    }

    removeContainer() {
        const { isDone, containerPath, containerMID, onWarning } = this;
        containerPath.remove();
        if (!isDone) {
            // TODO: Consider listing the operations that were skipped,
            // so a developer knows what extensions likely will not work.
            // An extension operating on a removed container indicates a conflict
            // between 2 modules
            onWarning(
                `A remove operation was executed on Container ` +
                    `${containerMID}, but other operations were still ` +
                    'pending on it. This most commonly indicates' +
                    'a conflict or ordering issue between modules/extensions'
            );
        }
        // Short-circuit operations, since there is no more work to do
        // on a removed Container
        this.step = this.operations.length;
    }

    /**
     * Remove a ContainerChild inside of a Container
     */
    removeChild() {
        const { currentOperation, onWarning } = this;
        const { targetChild } = currentOperation;
        const targetChildPath = this.findContainerChildByName(targetChild);
        if (!targetChildPath) {
            onWarning(
                `Attempted to remove a PWA Studio ContainerChild, but could not locate it\n` +
                    'operation: removeChild\n' +
                    `targetContainer: ${currentOperation.targetContainer}\n` +
                    `targetChild: ${currentOperation.targetChild}\n`
            );
            return;
        }
        targetChildPath.remove();
    }

    /**
     * Insert an element before the specified ContainerChild
     */
    insertBefore() {
        this.insertElementAdjacentToChild('before');
    }

    /**
     * Insert an element after the specified ContainerChild
     */
    insertAfter() {
        this.insertElementAdjacentToChild('after');
    }
}

/**
 * Given a Babel path wrapping a call to createElement,
 * will return the value of the specified prop, if present.
 * @param {Path} propsPath
 * @param {string} prop
 * @returns {Node}
 */
function getProp(callExprPath, propName) {
    const [, props] = callExprPath.get('arguments');
    // Could be a NullLiteral if the element has no props
    if (!props.isObjectExpression()) return;

    for (const prop of props.node.properties) {
        // Key can either be an identifier (.name) or a string literal (.value)
        const currentPropName = prop.key.value || prop.key.name;
        if (currentPropName === propName) return prop.value;
    }
}

/**
 * Given a Babel path wrapping a CallExpression,
 * returns a boolean indicating whether the path
 * is a call to React's createElement function
 * @param {Path} callExprPath
 * @param {string=} reactIdent String representing the identifier in scope for React
 * @param {string=} createElementIdent String representing the identifier in scope for createElement
 * @returns {bool}
 */
function isCreateElementCall(callExprPath, reactIdent, createElementIdent) {
    const callee = callExprPath.get('callee');
    // React.createElement()
    if (callee.isMemberExpression()) {
        return callee.matchesPattern(`${reactIdent}.createElement`);
    }

    // createElement()
    if (callee.isIdentifier()) {
        return callee.equals('name', createElementIdent);
    }

    return false;
}

/**
 * Given a Babel path wrapping the `Program` node, and
 * a regex for matching against module specifiers, returns
 * named (and default) imports pulled into scope from that
 * module, and their optionally aliased values
 * @param {Path} programPath
 * @param {RegExp} reModuleSpec
 * @returns {Array<{bindingName: string, local: string}>}
 */
function identifiersInScopeFromModule(programPath, reModuleSpec) {
    const targetImportDecls = programPath.get('body').filter(path => {
        if (!path.isImportDeclaration()) return;
        const moduleSpec = path.node.source.value;
        return reModuleSpec.test(moduleSpec);
    });

    return targetImportDecls.reduce((acc, importDecl) => {
        for (const spec of importDecl.node.specifiers) {
            acc.push({
                bindingName:
                    spec.type === 'ImportDefaultSpecifier'
                        ? 'default'
                        : spec.imported.name,
                local: spec.local.name
            });
        }

        return acc;
    }, []);
}
