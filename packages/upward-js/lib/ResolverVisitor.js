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
            throw new Error(`Context value '${propertyName}' not defined.`);
        }
        const defined = definition[propertyName];

        const resolver = this.getResolverFor(defined, propertyName);

        if (resolver) {
            return resolver.resolve(defined);
        }

        if (isPrimitive(defined)) {
            const definedString = defined.toString();
            debug(
                'defined: %s is primitive, yielding to context.get("%s")',
                definedString,
                definedString
            );
            return this.context.get(definedString);
        }

        if (typeof defined !== 'object' || !this.getResolverFailure) {
            throw new Error(`Unexpected value in config: ${defined}`);
        } else {
            throw new Error(this.getResolverFailure);
        }
    }
    getResolverFor(defined, propertyName) {
        let Resolver;
        for (Resolver of ResolverList) {
            const recognized =
                Resolver.recognize && Resolver.recognize(defined);
            if (recognized) {
                return {
                    resolve: () => new Resolver(this).resolve(recognized)
                };
            }
        }
        if (defined.resolver) {
            Resolver = ResolversByType[defined.resolver];
            if (!Resolver) {
                this.getResolverFailure = `Unrecognized resolver type: ${
                    defined.resolver
                }`;
            }
        } else {
            Resolver = ResolverList.find(({ telltale }) =>
                defined.hasOwnProperty(telltale)
            );
            if (!Resolver) {
                this.getResolverFailure = `Unrecognized configuration. Could not match a resolver to ${propertyName}: ${inspect(
                    defined
                )}`;
            }
        }
        if (Resolver) return new Resolver(this);
    }
}

module.exports = ResolverVisitor;
