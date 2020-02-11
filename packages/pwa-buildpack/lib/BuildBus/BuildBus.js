const path = require('path');
const pertain = require('pertain');
const TargetProvider = require('./TargetProvider');
const Trackable = require('./Trackable');

const FACTORY = Symbol('FORCE_BUILDBUS_CREATE_FACTORY');
class BuildBus extends Trackable {
    static create(context) {
        const id = path.dirname(context);
        const bus = new BuildBus(FACTORY, context, id);
        bus.identify(id, console.log);
        bus.runPhase('declare');
        bus.runPhase('intercept');
        return bus;
    }
    constructor(invoker, context, id) {
        super();
        if (invoker !== FACTORY) {
            throw new Error(
                `BuildBus must not be created with its constructor. Use the static factory method BuildBus.create(context) instead.`
            );
        }
        this.context = context;
        this.id = id;
        this.stops = new Map();
    }
    getTargetsOf(stopName) {
        const stop = this.stops.get(stopName);
        if (!stop) {
            throw new Error(
                `${
                    this.id
                }: Internal error: getTargetsOf(${stopName}): ${stopName} has not yet declared`
            );
        }
        return stop.own;
    }
    requestTargets(source, requested) {
        if (!this.stops.has(requested)) {
            throw new Error(
                `${this.id}: Package "${
                    source.name
                }" tried to intercept targets for "${requested}", but "${requested}" has not yet declared targets.`
            );
        }
        this.track('requestTargets', { source: source.name, requested });

        const targets = {};
        const requestedStop = this.stops.get(requested);
        for (const [name, tapable] of Object.entries(requestedStop._tapables)) {
            targets[name] = requestedStop._linkTarget(
                source.name,
                name,
                tapable
            );
        }
        return targets;
    }
    runPhase(phase) {
        this.track('runPhase', phase);
        pertain(this.context, `pwa-studio.targets.${phase}`).forEach(dep => {
            let stop = this.stops.get(dep.name);
            if (!stop) {
                stop = new TargetProvider(this, dep);
                this.stops.set(dep.name, stop);
            }
            stop.phase = phase;
            this.track('requireDep', phase, dep.name, dep.path);
            require(dep.path)(stop);
            stop.phase = null;
        });
    }
}

module.exports = BuildBus;
