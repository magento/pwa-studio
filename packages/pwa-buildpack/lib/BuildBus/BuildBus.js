const path = require('path');
const pertain = require('pertain');
const TargetProvider = require('./TargetProvider');
const Trackable = require('./Trackable');

const busCache = new Map();

const FACTORY = Symbol('FORCE_BUILDBUS_CREATE_FACTORY');
class BuildBus extends Trackable {
    static clear(context) {
        busCache.delete(context);
    }
    static clearAll() {
        busCache.clear();
    }
    static for(context) {
        const absContext = path.resolve(context);
        if (busCache.has(absContext)) {
            return busCache.get(absContext);
        }
        const id = path.dirname(absContext);
        const bus = new BuildBus(FACTORY, absContext, id);
        busCache.set(absContext, bus);
        bus.identify(id, console.log);
        bus.runPhase('declare');
        bus.runPhase('intercept');
        return bus;
    }
    constructor(invoker, context, id) {
        super();
        if (invoker !== FACTORY) {
            throw new Error(
                `BuildBus must not be created with its constructor. Use the static factory method BuildBus.for(context) instead.`
            );
        }
        this.context = context;
        this.id = id;
        this.targetProviders = new Map();
    }
    getTargetsOf(depName) {
        return this._getTargets(depName).own;
    }
    _getTargets(depName) {
        const targetProvider = this.targetProviders.get(depName);
        if (!targetProvider) {
            throw new Error(
                `${
                    this.id
                }: Cannot getTargetsOf("${depName}"): ${depName} has not yet declared`
            );
        }
        return targetProvider;
    }
    _requestTargets(source, requested) {
        this.track('requestTargets', { source, requested });

        const targets = {};
        const targetProvider = this._getTargets(requested);
        for (const [name, tapable] of Object.entries(
            targetProvider._tapables
        )) {
            targets[name] = targetProvider._linkTarget(source, name, tapable);
        }
        return targets;
    }
    runPhase(phase) {
        this.track('runPhase', phase);
        pertain(this.context, `pwa-studio.targets.${phase}`).forEach(dep => {
            let targetProvider = this.targetProviders.get(dep.name);
            if (!targetProvider) {
                targetProvider = new TargetProvider(this, dep, extDep =>
                    this._requestTargets(dep.name, extDep)
                );
                this.targetProviders.set(dep.name, targetProvider);
            }
            targetProvider.phase = phase;
            this.track('requireDep', phase, dep.name, dep.path);
            require(dep.path)(targetProvider);
            targetProvider.phase = null;
        });
    }
}

module.exports = BuildBus;
