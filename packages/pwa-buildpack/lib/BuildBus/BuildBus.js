const makeDebug = require('debug');
const Tapable = require('tapable');
const pertain = require('pertain');

const VALID_HOOKS = new Set(
    Object.values(Tapable).filter(v => typeof v === 'function')
);

class BuildBusStop {
    constructor(bus, dep) {
        this.debug = makeDebug(`${bus.debugTag}:${dep.name}`);
        this.bus = bus;
        this.name = dep.name;
        this.path = dep.path;
        this.phase = null;
        this.targets = new Map();
    }
    declareTarget(targetName, target) {
        if (!(target && VALID_HOOKS.has(target.constructor))) {
            throw new Error(
                `${this.bus.id}: Package "${
                    this.name
                }" declared target "${targetName}" with an invalid target type "${Object.prototype.toString.call(
                    target
                )}". Make sure you are not using a different version or instance of the Tapable library to declare your targets.`
            );
        }

        const targetType = target.constructor.name;
        if (this.phase !== 'declare') {
            console.warn(
                `${this.bus.id}: Package "${
                    this.name
                }" ran declareTarget("${targetName}", ${targetType}) in the "${
                    this.phase
                }" phase. Be sure this is what you want to do; other packages that expect to intercept these targets may never see them.`
            );
        }
        this.debug(`declared "${targetName}" as ${targetType}`);
        this.targets.set(targetName, target);
    }
    getTarget(depName, targetName) {
        if (this.phase !== 'intercept') {
            console.warn(
                `${this.bus.id}: Package "${
                    this.name
                }" ran getTarget("${depName}", "${targetName}") in the "${
                    this.phase
                }" phase. instead of the "intercept" phase. Be sure this is what you want to do; the requested target may not be available, or you may be too late.`
            );
        }
        if (!targetName) {
            return this.targets.get(depName);
        }

        this.debug(`requested ${depName} target "${targetName}"`);
        const depTargets = this.bus.requestTargets(this.name, depName);
        return depTargets.get(targetName);
    }
}

let busIds = 0;
const FACTORY = Symbol('FORCE_BUILDBUS_CREATE_FACTORY');
class BuildBus {
    static create(context) {
        const id = ++busIds;
        const bus = new BuildBus(FACTORY, context, id);
        bus.debug('created, running declare');
        bus.runPhase('declare');
        bus.runPhase('intercept');
        return bus;
    }
    constructor(invoker, context, id) {
        if (invoker !== FACTORY) {
            throw new Error(
                `BuildBus must not be created with its constructor. Use the static factory method BuildBus.create(context) instead.`
            );
        }
        this.context = context;
        this.id = id;
        this.debugTag = `pwa-buildpack:BuildBus:[${(id / 100)
            .toFixed(2)
            .slice(2)}]`;
        this.debug = makeDebug(this.debugTag);
        this.stops = new Map();
    }
    requestTargets(source, requested) {
        if (requested) {
            if (!this.stops.has(source)) {
                throw new Error(
                    `${
                        this.id
                    }: Package "${source}" tried to intercept targets for "${requested}", but "${requested}" was not found.`
                );
            }
            return this.stops.get(requested).targets;
        }
        // if one argument, then get own targets
        if (!this.stops.has(source)) {
            throw new Error(
                `${
                    this.id
                }: Package "${source}" targets are missing at intercept phase. Make sure that "${source}" declares targets in the "declare" phase. If it does, this usually means there is a problem with your filesystem.`
            );
        }
        return this.stops.get(source).targets;
    }
    runPhase(phase) {
        pertain(this.context, `pwa-studio.targets.${phase}`).forEach(dep => {
            let stop = this.stops.get(dep.name);
            if (!stop) {
                this.debug(`found ${dep.name}, creating bus stop api`);
                stop = new BuildBusStop(this, dep);
                this.stops.set(dep.name, stop);
            }
            stop.phase = phase;
            require(dep.path)(stop);
            stop.phase = null;
        });
    }
}

module.exports = BuildBus;
