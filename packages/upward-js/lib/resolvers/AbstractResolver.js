class AbstractResolver {
    static get resolverType() {
        throw new Error(
            'Internal error: Resolvers must define a static resolverType getter'
        );
    }
    static get paramTypes() {
        throw new Error(
            'Internal error: Resolvers must define a static paramTypes getter'
        );
    }
    constructor({ io, params, paramValidator, resolved }) {
        this.io = io;
        this.params = params;
        this.paramValidator = paramValidator;
        this.resolved = resolved;
    }
    declareDerivations() {
        throw new Error(
            'Internal error: Resolvers must define a declareDerivations() method'
        );
    }
    shouldResolve() {
        throw new Error(
            'Internal error: Resolvers must define a shouldResolve() method'
        );
    }
    async resolve() {
        throw new Error(
            'Internal error: Resolvers must define a resolve() method'
        );
    }
}

module.exports = AbstractResolver;
