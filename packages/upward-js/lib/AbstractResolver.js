class AbstractResolver {
    constructor(params) {
        this.validate(params);
    }
    validate() {
        throw Error(
            'Internal error: Resolvers must define a validate function'
        );
    }
}

module.exports = AbstractResolver;
