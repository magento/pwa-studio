module.exports = Operation =>
    class AddClassNameOperation extends Operation {
        setup({ options }) {
            this.state.classNameNode = this.parser.parseExpression(
                options.params.className
            );
        }
        run(path) {
            const { types: t } = this.babel;
            const openingElement = path.get('openingElement');
            const classAttrPath = openingElement
                .get('attributes')
                .find(
                    propPath =>
                        propPath.isJSXAttribute() &&
                        propPath.node.name.name === 'className'
                );
            if (!classAttrPath) {
                // then create the className prop!
                openingElement.pushContainer('attributes', [
                    t.jsxAttribute(
                        t.jsxIdentifier('className'),
                        this.state.classNameNode
                    )
                ]);
            } else {
                // it's something else, so concatenate to it
                const { value } = classAttrPath.node;
                classAttrPath
                    .get('value')
                    .replaceWith(
                        t.jsxExpressionContainer(
                            t.binaryExpression(
                                '+',
                                t.binaryExpression(
                                    '+',
                                    value.expression || value,
                                    t.stringLiteral(' ')
                                ),
                                this.state.classNameNode
                            )
                        )
                    );
            }
        }
    };
