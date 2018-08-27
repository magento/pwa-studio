const AbstractResolver = require('../AbstractResolver');

const illegalContextPropertyCharacters = /(^\.+)|[^\.\w]/;
class InternalContextResolver extends AbstractResolver {
    async analyze(registry) {
        this.rootProperty = this.params.split('.').shift();
        registry.registerDependency(this, this.rootProperty);
    }
    async resolve(context) {
        return context.lookup(this.params);
    }
    validate(str) {
        if (typeof str !== 'string') {
            throw new Error(
                `Internal error: InternalContextResolver received non-string param: ${str}`
            );
        }
        if (illegalContextPropertyCharacters.test(str)) {
            throw new Error(
                `Illegal context property name found: ${str}\nContext properties must be dot-separated strings and contain no special characters, and cannot begin with a dot.`
            );
        }
    }
}

module.exports = InternalContextResolver;
