module.exports = Operation =>
    class RemovePropsOperation extends Operation {
        setup() {
            this.state.propSet = new Set(this.params.props);
        }
        run(path) {
            const toRemove = new Set(this.state.propSet);
            path.get('openingElement.attributes').forEach(propPath => {
                if (
                    propPath.isJSXAttribute() &&
                    toRemove.has(propPath.node.name.name)
                ) {
                    propPath.remove();
                }
            });
        }
    };
