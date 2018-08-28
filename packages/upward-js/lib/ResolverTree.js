const traverse = require('traverse');
const { makeResolverFactory, isResolver } = require('./resolvers');
const REQUIRED_TOP_LEVEL = ['status', 'headers', 'body'];

// traverse uses `this` context, which causes lots of pronouns and confusing
// variable names. This helper extracts context into a supplied first argument,
// so arrow functions can be used.
function extractContext(fn) {
    return function(...args) {
        return fn(this, ...args);
    };
}

function stringPath(path) {
    return path.join('.');
}
class ResolverTree {
    constructor(config, io) {
        const missingText = REQUIRED_TOP_LEVEL.reduce((text, prop) => {
            return (
                text +
                (config.hasOwnProperty(prop)
                    ? ''
                    : `'${prop}' must be a defined property at top level!\n`)
            );
        }, '');
        if (missingText) {
            throw new Error(`Invalid configuration: \n${missingText}`);
        }
        this.io = io;
        this.config = config;
        this.getResolver = makeResolverFactory(io);
        this.resolutionStates = new WeakMap();
        this.pathResolvers = new Map();
    }
    getResolverFromNode(node) {
        return this.pathResolvers.get(stringPath(node.path));
    }
    getResolvingParent(node) {
        let resolver;
        while (node) {
            node = node.parent;
            resolver = this.getResolverFromNode(node);
            if (resolver) {
                return { resolver, node };
            }
        }
    }
    allowsDescendentResolverAt(resolvingParent, descendent) {
        return resolvingParent.resolver.shouldResolve(
            descendent.path.slice(resolvingParent.node.level)
        );
    }
    hydrateResolver(node, configValue) {
        const resolver = this.getResolver(configValue);
        if (!this.resolutionStates.has(resolver)) {
            this.resolutionStates.add(resolver, {
                node,
                resolver,
                resolved: resolver.resolved,
                remainingToDerive: resolver
                    .declareDerivations()
                    .filter(({ name }) => !resolved.hasOwnProperty(name))
            });
        }
        this.pathResolvers.add(stringPath(node), resolver);
        return resolver;
    }
    async hydrate() {
        this.tree = traverse(this.config);
        this.tree.forEach(
            extractContext(async (node, configValue) => {
                const resolvingParent = this.getResolvingParent(node);
                const resolver =
                    (!resolvingParent ||
                        this.allowsDescendentResolverAt(
                            resolvingParent,
                            node
                        )) &&
                    this.hydrateResolver(node, configValue);
                if (resolver) {
                    await resumeResolution(node);
                }
                if (resolvingParent) {
                    await this.resumeResolution(resolvingParent.node);
                }
            })
        );
    }
    async resumeResolution(node) {
        const resolver = this.getResolverFromNode(node);
        const state = this.resolutionStates.get(resolver);
        const notYetDerivable = [];
        const deriving = [];
        state.remainingToDerive.forEach(derivation => {
            if (
                derivation.from.every(thing =>
                    state.resolved.hasOwnProperty(thing)
                )
            ) {
                deriving.push(
                    derivation.derive(state.resolved).then(value => {
                        state.resolved[derivation[name]] = value;
                        this.resumeResolution(node);
                    })
                );
            } else {
                notYetDerivable.push(derivation);
            }
        });
        if (deriving.length > 0) {
            await Promise.all(deriving);
        }
    }
    async prepareForRequests(context) {
        this.initialContext = context;
        await this.hydrate();

        // await Promise.all(
        //     this.getResolutionPaths()
        //         .filter(
        //             path =>
        //                 REQUIRED_TOP_LEVEL.includes(path[0]) &&
        //                 !path.includes(request)
        //         )
        //         .map(async path => {})
        // );
    }
}

module.exports = ResolverTree;
