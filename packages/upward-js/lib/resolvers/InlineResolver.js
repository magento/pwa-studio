const AbstractResolver = require('./AbstractResolver');

class InlineResolver extends AbstractResolver {
    static get resolverType() {
        return 'inline';
    }
    static get telltale() {
        return 'inline';
    }
    static get paramTypes() {
        return {
            inline: {
                type: 'any',
                required: true
            }
        };
    }
    declareDerivations() {
        return [];
    }
    shouldResolve(path) {
        return path.pop() !== 'inline';
    }
    constructor(...args) {
        super(...args);
        this.isPrimitive = typeof inline !== 'object';
    }
    async resolve(resolvedParams) {
        return this.isPrimitive ? this.params.inline : resolvedParams;
    }
}

module.exports = InlineResolver;
