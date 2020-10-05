module.exports = Operation =>
    class SetPropsOperation extends Operation {
        setup({
            options: {
                params: { props }
            }
        }) {
            /**
             * The fastest attribute matching needs a particular data structure, a
             * Map with the attr name as a string, and the attr value as an AST.
             * Gotta make it in a few stages.
             */
            // Props comes in as an object<string,string>
            const attributeSources = Object.entries(props);
            // this.parser.parseAttributes returns JSXAttribute[]
            const parsedAttributes = this.parser.parseAttributes(
                attributeSources
            );
            // attributesByName will be a Map()<string, JSXAttribute>
            this.state.attributesByName = new Map();
            // The props entries and the parsed attributes are the same length,
            // so we'll use the index argument of forEach to count through both.
            attributeSources.forEach(([name], index) => {
                this.state.attributesByName.set(name, parsedAttributes[index]);
            });
        }
        run(path) {
            // Make a copy to use to keep track
            const remainingToSet = new Map(this.state.attributesByName);
            const openingElement = path.get('openingElement');

            openingElement.get('attributes').forEach(propPath => {
                if (!propPath.isJSXAttribute()) {
                    return; // spread attributes not supported yet
                }
                const { name } = propPath.node.name;
                const valuePath = propPath.get('value');
                if (remainingToSet.has(name)) {
                    valuePath.replaceWith(remainingToSet.get(name).value);
                    remainingToSet.delete(name);
                }
            });
            // create remaining props that weren't present and therefore deleted
            if (remainingToSet.size > 0) {
                openingElement.node.attributes.push(...remainingToSet.values());
            }
        }
    };
