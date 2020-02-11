const Target = require('./Target');
const Tapable = require('tapable');
const Trackable = require('./Trackable');

const allowedTargetTypes = [
    'Sync',
    'SyncBail',
    'SyncWaterfall',
    'SyncLoop',
    'AsyncParallel',
    'AsyncParallelBail',
    'AsyncSeries',
    'AsyncSeriesBail',
    'AsyncSeriesWaterfall'
];

const VALID_TYPES = new Map();

const types = {};

for (const type of allowedTargetTypes) {
    const TargetClass = Tapable[type + 'Hook']; // We will call them targets.
    types[type] = TargetClass;
    VALID_TYPES.set(TargetClass, type);
}

const appearsToBeHook = thing =>
    thing &&
    typeof thing === 'object' &&
    (typeof thing.tap === 'function' || typeof thing.tapAsync === 'function') &&
    typeof thing.intercept === 'function' &&
    typeof thing.call === 'function';

const getType = thing => VALID_TYPES.get(thing.constructor) || '<unknown>';

class TargetProvider extends Trackable {
    constructor(bus, dep) {
        super();
        this.identify(dep.name, bus);
        this._bus = bus;
        this.name = dep.name;
        this._tapables = {};
        this._intercepted = {};
        this.own = {};
        this.phase = null;
    }
    _linkTarget(requestorName, targetName, tapable) {
        return new Target(
            this,
            requestorName,
            targetName,
            getType(tapable),
            tapable
        );
    }
    declare(declarations) {
        if (this.phase !== 'declare') {
            this.track(
                'warning',

                {
                    type: 'lifecycle',
                    message: `ran declare() in the "${
                        this.phase
                    }" phase. Be sure this is what you want to do; other packages that expect to intercept these targets may never see them.`
                }
            );
        }
        for (const [targetName, hook] of Object.entries(declarations)) {
            if (!appearsToBeHook(hook)) {
                throw new Error(
                    `${this._bus.id}: Package "${
                        this.name
                    }" declared target "${targetName}" with an invalid target type "${{}.toString.call(
                        hook
                    )}". Make sure you are not using a different version or instance of the Tapable library to declare your targets.`
                );
            }

            this.track('declare', { targetName, tapableType: getType(hook) });
            this._tapables[targetName] = hook;
            this.own[targetName] = this._linkTarget(
                this.name,
                targetName,
                hook
            );
        }
    }
    of(depName) {
        if (this.phase !== 'intercept') {
            this.track(
                'warning',

                {
                    type: 'lifecycle',
                    message: `ran of(${depName}) in the "${
                        this.phase
                    }" phase. Be sure this is what you want to do; outside the intercept phase, this behavior is not guaranteed.`
                }
            );
        }
        if (depName === this.name) {
            return this.own[depName];
        }
        if (!this._intercepted[depName]) {
            this._intercepted[depName] = this._bus.requestTargets(
                this,
                depName
            );
        }
        return this._intercepted[depName];
    }
    toJSON() {
        const json = super.toJSON();
        if (this.phase) {
            json.phase = this.phase;
        }
        return json;
    }
}

TargetProvider.prototype.types = types;

module.exports = TargetProvider;
