const types = {
    ESModule: require('./TargetableESModule'),
    ESModuleArray: require('./TargetableESModuleArray'),
    ESModuleObject: require('./TargetableESModuleObject'),
    Module: require('./TargetableModule'),
    ReactComponent: require('./TargetableReactComponent')
};
const TargetProvider = require('../../BuildBus/TargetProvider');

/**
 * A factory and manager for Targetable instances.
 * This class wraps around a TargetProvider, which identifies it as "your"
 * Targetable and enables automatic interception of targets.
 */
class TargetableSet {
    /**
     * Creates a new TargetableSet bound to a TargetProvider
     *
     * @param {TargetProvider} targets - TargetProvider for the curent dependency. This is the object passed by BuildBus to an intercept function.
     * @returns {TargetableSet}
     */
    static using(targets) {
        return new TargetableSet(targets);
    }
    /** @hideconstructor  */
    constructor(targetProvider) {
        if (!(targetProvider instanceof TargetProvider)) {
            throw new Error(
                'Must supply a TargetProvider to a new TargetableSet.'
            );
        }
        this._targetProvider = targetProvider;
        this._builtins = targetProvider.of('@magento/pwa-buildpack');
        this._owner = targetProvider.name;
        this._connectedFiles = new Map();

        this._bind();
    }

    /**
     * @param {string} modulePath - Path to the module file this Targetable represents.
     * @param {TargetablePublisher} [publisher] - Callback function to execute when this module
     * is about to commit its requested transforms to a build. If this function is passed,
     * the module will automatically bind to `builtins.transformModules`.
     * @returns {TargetableModule} Returns an instance of TargetableModule.
     */
    module(modulePath, publisher) {
        return this._provide(types.Module, modulePath, publisher);
    }

    /**
     * @param {string} modulePath - Path to the module file this Targetable represents.
     * @param {TargetablePublisher} [publisher] - Callback function to execute when this module
     * is about to commit its requested transforms to a build. If this function is passed,
     * the module will automatically bind to `builtins.transformModules`.
     * @returns {TargetableESModule} Returns an instance of TargetableESModule.
     */
    esModule(modulePath, publisher) {
        return this._provide(types.ESModule, modulePath, publisher);
    }

    /**
     * @param {string} modulePath - Path to the module file this Targetable represents.
     * @param {TargetablePublisher} [publisher] - Callback function to execute when this module
     * is about to commit its requested transforms to a build. If this function is passed,
     * the module will automatically bind to `builtins.transformModules`.
     * @returns {TargetableESModuleArray} Returns an instance of TargetableESModuleArray.
     */
    esModuleArray(modulePath, publisher) {
        return this._provide(types.ESModuleArray, modulePath, publisher);
    }

    /**
     * @param {string} modulePath - Path to the module file this Targetable represents.
     * @param {TargetablePublisher} [publisher] - Callback function to execute when this module
     * is about to commit its requested transforms to a build. If this function is passed,
     * the module will automatically bind to `builtins.transformModules`.
     * @returns {TargetableESModuleObject} Returns an instance of TargetableESModuleObject.
     */
    esModuleObject(modulePath, publisher) {
        return this._provide(types.ESModuleObject, modulePath, publisher);
    }

    /**
     * @param {string} modulePath - Path to the module file this Targetable represents.
     * @param {TargetablePublisher} [publisher] - Callback function to execute when this module
     * is about to commit its requested transforms to a build. If this function is passed,
     * the module will automatically bind to `builtins.transformModules`.
     * @returns {TargetableReactComponent} Returns an instance of TargetableReactComponent
     */
    reactComponent(modulePath, publisher) {
        return this._provide(types.ReactComponent, modulePath, publisher);
    }

    /**
     * Taps the builtin `specialFeatures` target and sets the supplied feature flags.
     *
     * @param {...(string|string[]|object<string,boolean>)} Feature flags to set, as either string arguments, an array of string arguments, or an object of flags.
     */
    setSpecialFeatures(...featureArgs) {
        const owner = this._owner;

        // support args list, array of args, and flags object
        const flags = featureArgs.reduce((flagObj, arg) => {
            const setFlag = name => {
                flagObj[name] = true;
            };
            if (typeof arg === 'string') {
                setFlag(arg);
            } else if (Array.isArray(arg)) {
                arg.forEach(setFlag);
            } else {
                Object.assign(flagObj, arg);
            }
            return flagObj;
        }, {});

        this._builtins.specialFeatures.tap(features => {
            features[owner] = features[owner] || {};
            Object.assign(features[owner], flags);
        });
    }
    /**
     * Tap the builtin `envVarDefinitions` target to define new environment variables.
     *
     * @param {string} sectionName - Human-readable name of section. If a
     * section with this name exists already, variables will be added to it
     * instead o a new section being created.
     * @param {EnvVarDefinition[]} variables - List of variables to add.
     */
    defineEnvVars(sectionName, variableDefs) {
        this._builtins.envVarDefinitions.tap(defs => {
            let mySection = defs.sections.find(
                section => section.name === sectionName
            );
            if (!mySection) {
                mySection = { name: sectionName, variables: [] };
                defs.sections.push(mySection);
            }
            mySection.variables.push(...variableDefs);
        });
    }
    _bind() {
        this._builtins.transformModules.tapPromise(
            'TargetableSet',
            async addTransform => {
                for (const [
                    instance,
                    config
                ] of this._connectedFiles.values()) {
                    if (typeof config.publish === 'function') {
                        await config.publish.call(
                            instance,
                            this._targetProvider.own,
                            instance
                        );
                    }
                    instance.flush().forEach(addTransform);
                }
            }
        );
    }
    _normalizeConfig(firstArg, secondArg) {
        const config =
            typeof firstArg === 'string'
                ? {
                      module: firstArg,
                      publish: (secondArg && secondArg.publish) || secondArg
                  }
                : firstArg;
        return config;
    }
    _provide(Targetable, modulePath, publisher) {
        const config = this._normalizeConfig(modulePath, publisher);
        let extant = this._connectedFiles.get(config.module);
        if (!extant) {
            const targetable = new Targetable(
                config.module,
                this._targetProvider
            );
            extant = [targetable, config];
            this._connectedFiles.set(config.module, extant);
        }
        const [instance] = extant;
        if (instance instanceof Targetable) {
            return instance;
        }
        throw new Error(
            `Cannot target the file "${modulePath}" using "${
                Targetable.name
            }", because it has already been targeted by the ${
                instance.constructor.name
            } created by "${this._targetProvider.name}".`
        );
    }
}

Object.assign(TargetableSet, types);

module.exports = TargetableSet;

/** Type definitions related to: TargetableSet */

/**
 * Callback function which runs before committing this module's list of requested transforms to the build. Invoked as an intercept to `builtins.transformModules`, this is the typical time to invoke your own target with your custom API.
 *
 * @callback TargetablePublisher
 * @this {TargetableModule}
 * @param {TargetableModule} self - The TargetableModule instance (for use if `this` is not available)
 *
 */
