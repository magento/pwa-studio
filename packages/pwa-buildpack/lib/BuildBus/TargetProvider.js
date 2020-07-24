/**
 * @module Buildpack/BuildBus
 */
const Target = require('./Target');
const Trackable = require('./Trackable');
const {
    appearsToBeTapable,
    getTapableType,
    types
} = require('./mapHooksToTargets');

/**
 * Respond to a request from a [TargetProvider]{@link https://pwastudio.io/pwa-buildpack/reference/buildbus/targetprovider/}
 * to retrieve a different(external) TargetProvider.
 *
 * This callback pattern helps to loosely couple TargetProviders so
 * they are more testable.
 *
 * @callback getExternalTargets
 * @param {TargetProvider} requestor - TargetProvider making the request.
 * @param {string} requested - External targets being requested.
 * @returns {TargetProvider} TargetProvider for the requested targets.
 */

/**
 * Handles interactions between a BuildBus and an "extension" package
 * participating in the BuildBus declare/intercept lifecycle.
 *
 * The `targets` object used by declare and intercept functions is a TargetProvider.
 * Each extension receives its own TargetProvider, which provides methods for
 * declaring its own targets, intercepting its own targets, and intercepting the
 * targets of other extensions.
 *
 * @extends {Trackable}
 */
class TargetProvider extends Trackable {
    /**
     * Creates an instance of TargetProvider.
     *
     * @constructs
     *
     * @param {BuildBus|function} bus - BuildBus using this TargetProvider, or, when testing, a logging function.
     * @param {Object} dep - The package which owns this TargetProvider.
     * @param {string} dep.name - Name of the package which owns this.
     * @param {getExternalTargets} getExternalTargets - Function this TargetProvider will use to retrieve external packages when they are requested with `.of()`.
     * Should usually be a delegate to BuildBus's [`getExternalTargets()`]{@link http://pwastudio.io/pwa-buildpack/reference/buildbus/targetprovider/#buildpackbuildbusgetexternaltargets--targetprovider}
     *
     * @memberof TargetProvider
     */
    constructor(bus, dep, getExternalTargets) {
        super();
        this.attach(dep.name, bus);
        this._getExternalTargets = getExternalTargets;
        /** @type string */
        this.name = dep.name;
        this._tapables = {};
        this._intercepted = {};
        /**
         * The targets this package has declared in the `declare` phase.
         * @type Object<string,Target>
         */
        this.own = {};
        /**
         * The phase currently being executed. Either `declare` or `intercept`.
         * @type string
         */
        this.phase = null;
    }
    /** @ignore */
    _linkTarget(requestorName, targetName, tapable) {
        const TargetClass =
            requestorName === this.name ? Target : Target.External;
        return new TargetClass(
            this,
            requestorName,
            targetName,
            getTapableType(tapable),
            tapable
        );
    }
    /**
     * Call this function in the declare phase to register targets that this package and
     * other packages can intercept.
     *
     * @param {Object.<string,Target>} declarations - An object whose keys are
     * the names of targets to declare, and whose properties are newly
     * constructed Targets.
     */
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
            if (!appearsToBeTapable(hook)) {
                throw new Error(
                    `Package "${
                        this.name
                    }" declared target "${targetName}" with an invalid target type "${{}.toString.call(
                        hook
                    )}". Make sure you are not using a different version or instance of the Tapable library to declare your targets.`
                );
            }

            this.track('declare', {
                targetName,
                tapableType: getTapableType(hook)
            });
            this._tapables[targetName] = hook;
            this.own[targetName] = this._linkTarget(
                this.name,
                targetName,
                hook
            );
        }
    }
    /**
     * Call this function in the intercept phase to get the targets of other packages, which
     * can then be intercepted by calling `.tap()` methods on them.
     *
     * @param {string} depName - The package whose targets you want to retrieve.
     * @returns {Object.<string,Target>} - An object whose keys are the names
     * of the requested package's targets, and whose values are the target
     * objects.
     */
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
            return this.own;
        }
        if (!this._intercepted[depName]) {
            this._intercepted[depName] = this._getExternalTargets(
                this,
                depName
            );
        }
        return this._intercepted[depName];
    }
    /**
     * @inner
     * Serialize state for use in logging.
     */
    toJSON() {
        const json = super.toJSON();
        if (json && this.phase) {
            json.phase = this.phase;
        }
        return json;
    }
}

/**
 * Constructors for the different Target classes.
 * @memberof TargetProvider
 * @type {Object.<string,Tapable.Hook>}
 */
TargetProvider.prototype.types = types;

module.exports = TargetProvider;
