module.exports = Operation =>
    class RemovePropsOperation extends Operation {
        setup() {
            this.state.toRemove = new Set(this.params.props);
        }
        run(path) {
            path.get('openingElement.attributes').forEach(propPath => {
                if (
                    propPath.isJSXAttribute() &&
                    this.state.toRemove.has(propPath.node.name.name)
                ) {
                    propPath.remove();
                }
            });
        }
    };
