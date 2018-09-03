const { detectFromArguments } = require('./resolvers');

const REQUIRED_TOP_LEVEL = ['status', 'headers', 'body'];

class ResolverTree {
    constructor({ ResolvingParent, resolutionPath, definition, io }) {
        this.ResolvingParent = ResolvingParent;
        this.resolutionPath = resolutionPath;
        this.definition = definition;
        this.definitionEntries = Object.entries(definition);
        this.io = io;
        this.Resolver = detectFromArguments(this.definition);
    }
}

class ResolverArguments {
    constructor({ ResolvingParent, definition, io }) {
        this.ResolvingParent = ResolvingParent;
        this.definition = definition;
        this.entries = Object.entries(definition);
    }
}

module.exports = ResolverTree;
// traverse uses `this` context, which causes lots of pronouns and confusing
// variable names. This helper extracts context into a supplied first argument,
// so arrow functions can be used.
/*
function extractContext(fn) {
    return function(...args) {
        return fn(this, ...args);
    };
}

function stringPath(path) {
    return path.join('.');
}

class ConfigPath {
    constructor(parentPath, newSegment) {
        this._newSegment = newSegment;
        if (!parentPath) {
            this._segments = [];
        } else {
            this._segments = parentPath.segments().concat(newSegment);
        }
    }
    base() {
        return this._segments[0];
    }
    contains(otherPath) {
        return this._segments.every((segment, i) => otherPath.keyAt(i) === i);
    }
    containsSegment(segment) {
        return this._segments.some(mySegment => mySegment === segment);
    }
    depth() {
        return this._segments.length;
    }
    keyAt(index) {
        return this._segments[index];
    }
    from(ancestor) {
        return this._segments.slice(ancestor.depth());
    }
    toString() {
        return `context:${this._segments.join('.')}`;
    }
}

class ConfigNode {
    constructor(io, key, value, parent) {
        this.io = io;
        this.key = key;
        this.value = value;
        this.parent = parent;
        this.path = new ConfigPath(parent && parent.path, key);
        this.detectResolver = makeResolverFactory(io);
    }
    hydrate() {

    }
}

class RootNode extends ConfigNode {}

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
        this.root = new Inline({ inline: config }, io);
        // this.getResolver = makeResolverFactory(io);
        // this.resolutionStates = new WeakMap();
        // this.pathResolvers = new Map();
    }
    async initializeWithContext(context) {
        await this.traverse(this.root);
    }
    traverse(node) {}
    getResolverFromNode(node) {
        return this.pathResolvers.get(stringPath(node.path));
    }
    getResolvingParent(node) {
        let resolver;
        do {
            resolver = this.getResolverFromNode(node);
            if (resolver) {
                return { resolver, node };
            }
        } while ((node = node.parent));
    }
    allowsDescendentResolverAt(resolvingParent, descendent) {
        return resolvingParent.resolver.shouldResolve(
            descendent.path.slice(resolvingParent.node.level)
        );
    }
    hydrateResolver(node, configValue) {
        const resolver = this.getResolver(configValue);
        if (!this.resolutionStates.has(resolver)) {
            this.resolutionStates.set(resolver, {
                node,
                resolver,
                resolved: resolver.resolved,
                remainingToDerive: resolver
                    .declareDerivations()
                    .filter(({ name }) => !resolved.hasOwnProperty(name))
            });
        }
        this.pathResolvers.set(stringPath(node.path), resolver);
        return resolver;
    }
    async hydrate() {
        this.tree = traverse(this.config);
        const iteratees = [];
        this.tree.forEach(
            extractContext((node, configValue) => {
                const resolvingParent = this.getResolvingParent(node);
                const resolver =
                    (!resolvingParent ||
                        this.allowsDescendentResolverAt(
                            resolvingParent,
                            node
                        )) &&
                    this.hydrateResolver(node, configValue);
                if (resolver) {
                    iteratees.push(this.resumeResolution(node));
                } else if (resolvingParent) {
                    iteratees.push(this.resumeResolution(resolvingParent.node));
                }
            })
        );
        return Promise.all(iteratees);
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
    // async prepareForRequests(context) {
    //     this.initialContext = context;
    //     return this.hydrate().catch(e => {
    //         throw new Error(e.stack);
    //     });

    //     // await Promise.all(
    //     //     this.getResolutionPaths()
    //     //         .filter(
    //     //             path =>
    //     //                 REQUIRED_TOP_LEVEL.includes(path[0]) &&
    //     //                 !path.includes(request)
    //     //         )
    //     //         .map(async path => {})
    //     // );
    // }
}

module.exports = ResolverTree;
*/
