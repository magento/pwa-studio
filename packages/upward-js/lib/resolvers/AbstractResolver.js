class AbstractResolver {
    static get resolverType() {
        throw new Error(
            'Internal error: Resolvers must define a static resolverType getter'
        );
    }
    constructor(visitor) {
        this.visitor = visitor;
    }
    resolve() {
        throw new Error(
            'Internal error: Resolvers must define a resolve() method'
        );
    }
}

module.exports = AbstractResolver;
