const debug = require('debug')('upward-js:ResolverVisitor');
const { inspect } = require('util');
const { ResolverList, ResolversByType } = require('./resolvers');
const { zipObject } = require('lodash');
const isPrimitive = require('./isPrimitive');

class ResolverVisitor {
    constructor(io, rootDefinition, context) {
        this.io = io;
        this.rootDefinition = rootDefinition;
        this.context = context;
        this.context.setVisitor(this);
    }
    async downward(contextNames) {
        debug('resolving downward: %o', contextNames);
        let passedMiddleware = false;
        const valuePromises = contextNames.map(async name => {
            const value = await this.upward(this.rootDefinition, name);
            if (typeof value === 'function') {
                debug(
                    '%s request returned a function, we are assuming it is a middleware'
                );
                passedMiddleware = value;
                throw new Error('PASSED_MIDDLEWARE');
            }
            return value;
        });
        try {
            const values = await Promise.all(valuePromises);
            return zipObject(contextNames, values);
        } catch (e) {
            if (e.message === 'PASSED_MIDDLEWARE') {
                debug(
                    `returning middleware from visitor.downward() instead of object`
                );
                return passedMiddleware;
            } else {
                throw e;
            }
        }
    }
    async upward(definition, propertyName) {
        debug('resolving upward: %s from %o', propertyName, definition);
        if (!definition.hasOwnProperty(propertyName)) {
            throw new Error(
                `Context value '${propertyName}' not defined in ${inspect(
                    definition
                )}.`
            );
        }
        const defined = definition[propertyName];

        const resolver = this.getResolverFor(defined, propertyName);

        if (resolver) {
            return resolver.resolve(defined);
        }

        if (isPrimitive(defined)) {
            debug(
                'defined: %s is primitive, yielding to context.get("%s")',
                defined,
                defined
            );
            return this.context.get(defined);
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
