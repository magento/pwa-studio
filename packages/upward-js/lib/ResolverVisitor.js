const debug = require('debug')('upward-js:ResolverVisitor');
const { inspect } = require('util');
const { ResolverList, ResolversByType } = require('./resolvers');
const isPrimitive = require('./isPrimitive');

class ResolverVisitor {
    constructor(io, rootDefinition, context) {
        this.io = io;
        this.rootDefinition = rootDefinition;
        this.context = context;
        this.context.setVisitor(this);
    }
    async downward(contextName) {
        debug('resolving downward: %s', contextName);
        return this.upward(this.rootDefinition, contextName);
    }
    async upward(definition, propertyName) {
        debug('resolving upward: %s from %o', propertyName, definition);
        if (!definition.hasOwnProperty(propertyName)) {
            throw new Error(`Context value '${propertyName}' not present.`);
        }
        const defined = definition[propertyName];

        if (isPrimitive(defined)) {
            const definedString = defined.toString();
            debug(
                'defined: %s is primitive, yielding to context.get',
                definedString
            );
            return this.context.get(definedString);
        }

        if (typeof defined !== 'object') {
            throw new Error(`Unexpected value in config: ${defined}`);
        }

        let Resolver;
        if (defined.resolver) {
            Resolver = ResolversByType[defined.resolver];
            if (!Resolver) {
                throw new Error(
                    `Unrecognized resolver type: ${defined.resolver}`
                );
            }
        } else {
            Resolver = ResolverList.find(({ telltale }) =>
                defined.hasOwnProperty(telltale)
            );
            if (!Resolver) {
                throw new Error(
                    `Unrecognized configuration. Could not match a resolver to ${propertyName}: ${inspect(
                        defined
                    )}`
                );
            }
        }
        return new Resolver(this).resolve(defined);
    }
}

module.exports = ResolverVisitor;
