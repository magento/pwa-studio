/**
 * @module @magento/pwa-buildpack
 */

const path = require('path');
const pertain = require('pertain');
const TargetProvider = require('./TargetProvider');
const Trackable = require('./Trackable');

/**
 * @ignore
 * A given project root (context) should always produce the same bus, so we can
 * cache the heavy pertain operation.
 */
const busCache = new Map();

/**
 * @ignore
 * A way to strongly encourage users to use the BuildBus.for factory and not the
 * BuildBus constructor.
 */
const INVOKE_FLAG = Symbol.for('FORCE_BUILDBUS_CREATE_FACTORY');

/**
 * Manages dependency participation in project builds and tasks.
 * It executes their declare and intercept files so they can interact with each other.
 */
class BuildBus extends Trackable {
    /**
     * Remove the cached BuildBus for the given context.
     *
     * @static
     * @param {string} context - Root directory whose BuildBus to delete.
     */
    static clear(context) {
        const absContext = path.resolve(context);
        busCache.delete(absContext);
    }
    /**
     * Remove all cached BuildBus objects.
     *
     * @static
     */
    static clearAll() {
        busCache.clear();
    }
    /**
     * Get or create the BuildBus for the given context.
     * This factory is the supported way to construct BuildBus instances.
     * It caches the instances and connects them to the logging infrastructure.
     *
     * Only one BuildBus is active for a project root directory (context) at any given time.
     * This way, Buildpack code can retrieve the BuildBus for a context even if the bus
     * instance hasn't been sent as a parameter.
     *
     * @example <caption>Get or create the BuildBus for the package.json file in `./project-dir`, then bind targets, then call a target.</caption>
     * ```js
     * const bus = BuildBus.for('./project-dir);
     * bus.init();
     * bus.getTargetsOf('my-extension').myTarget.call();
     * ```
     *
     * @param {string} context - Root directory of the BuildBus to get or create.
     * @returns {BuildBus}
     */
    static for(context) {
        const absContext = path.resolve(context);
        if (busCache.has(absContext)) {
            return busCache.get(absContext);
        }
        const bus = new BuildBus(INVOKE_FLAG, absContext);
        busCache.set(absContext, bus);
        bus.attach(context, console.log); //usually replaced w/ webpack logger
        return bus;
    }
    constructor(invoker, context) {
        super();
        if (invoker !== INVOKE_FLAG) {
            throw new Error(
                `BuildBus must not be created with its constructor. Use the static factory method BuildBus.for(context) instead.`
            );
        }
        this._requestTargets = this._requestTargets.bind(this);
        this._hasRun = {};
        this.context = context;
        this.targetProviders = new Map();
        this._getEnvOverrides();
    }
    /** @private */
    _getEnvOverrides() {
        const envDepsAdditional = process.env.BUILDBUS_DEPS_ADDITIONAL;
        this._depsAdditional = envDepsAdditional
            ? envDepsAdditional.split(',')
            : [];
    }
    /** @private */
    _getPertaining(phase) {
        return pertain(this.context, this._phaseToSubject(phase), foundDeps =>
            foundDeps.concat(this._depsAdditional)
        ).map(dep => ({
            name: dep.name,
            [phase]: require(dep.path)
        }));
    }
    /** @private */
    _getTargets(depName) {
        const targetProvider = this.targetProviders.get(depName);
        if (!targetProvider) {
            throw new Error(
                `${
                    this._identifier
                }: Cannot getTargetsOf("${depName}"): ${depName} has not yet declared`
            );
        }
        return targetProvider;
    }
    /** @private */
    _phaseToSubject(phase) {
        return `pwa-studio.targets.${phase}`;
    }
    /**
     * Connects TargetProviders to each other. BuildBus passes
     * this method to TargetProvider as its `getExternalTargets()` callback.
     *
     * @private
     * @param {Object} requestor - Dependency requesting the targets.
     * @param {string} requestor.name - Name of the dependency requesting targets.
     * @param {string} requested - Name of the dependency whose targets are being requested.
     * @returns {Object<string,Target>} - Object whose strings are target names and whose values are the Targets of the external dependency.
     */
    _requestTargets(requestor, requested) {
        const source = requestor.name;
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
    /**
     * Get {@link TargetProvider} for the given named dependency. Use this to
     * retrieve and run targets in top-level code, when you have a reference to
     * the BuildBus. Declare and intercept functions should not, and cannot,
     * use this method. Instead, they retrieve external targets through their
     * `targets.of()` methods.
     *
     * @param {string} depName - Dependency whose targets to retrieve.
     * @returns {Object.<string, Target>} TargetProvider for the dependency.
     */
    getTargetsOf(depName) {
        return this._getTargets(depName).own;
    }
    /**
     * Run the two defined phases, `declare` and `intercept`, in order.
     * This binds all targets which the BuildBus can find by analyzing
     * dependencies in the project package file.
     *
     * @chainable
     * @returns {BuildBus} Returns this instance (chainable).
     */
    init() {
        this.runPhase('declare');
        this.runPhase('intercept');
        return this;
    }
    /**
     * Run the specified phase. The BuildBus finds all dependencies which say
     * in their `package.json` that they need to run code in this phase.
     *
     * @example <caption>Find all dependencies whith have `pwa-studio: { targets: { declare: './path/to/js' }} defined, and run those functions.
     * bus.runPhase('declare')
     *
     * @param {string} phase 'declare' or 'intercept'
     */
    runPhase(phase) {
        if (this._hasRun[phase]) {
            return;
        }
        this._hasRun[phase] = true;
        this.track('runPhase', { phase });
        const pertaining = this._getPertaining(phase);
        pertaining.forEach(dep => {
            let targetProvider = this.targetProviders.get(dep.name);
            if (!targetProvider) {
                targetProvider = new TargetProvider(
                    this,
                    dep,
                    this._requestTargets
                );
                this.targetProviders.set(dep.name, targetProvider);
            }
            targetProvider.phase = phase;
            this.track('requireDep', { phase, dep });
            dep[phase](targetProvider);
            targetProvider.phase = null;
        });
    }
}

module.exports = BuildBus;
