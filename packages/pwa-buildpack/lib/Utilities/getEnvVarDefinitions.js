/**
 * @module Buildpack/Utilities
 */
const debug = require('debug')('pwa-buildpack:getEnvVarDefinitions');

/**
 * Get the list of environment definitions.
 * Calling this function will invoke the [`envVarDefinitions`]{@link http://pwastudio.io/pwa-buildpack/reference/buildbus/targets/#module_BuiltinTargets.envVarDefinitions}
 * target, passing the list of [built-in environment variables]{@link http://pwastudio.io/pwa-buildpack/reference/environment-variables/core-definitions/}
 * to all interceptors.
 * Any installed dependencies that intercept this target may add to or modify the list of environment variables.
 *
 * @public
 * @memberof Buildpack/Utilities
 * @param {string} context Project root directory.
 * @returns {EnvVarDefinitions}
 */
function getEnvVarDefinitions(context) {
    // Fastest way to copy a pure-JSON object.
    const definitions = JSON.parse(
        JSON.stringify(require('../../envVarDefinitions.json'))
    );
    try {
        const BuildBus = require('../BuildBus');
        /* istanbul ignore next */
        if (process.env.DEBUG && process.env.DEBUG.includes('BuildBus')) {
            BuildBus.enableTracking();
        }
        const bus = BuildBus.for(context);
        bus.init();
        bus.getTargetsOf('@magento/pwa-buildpack').envVarDefinitions.call(
            definitions
        );
        debug(
            'BuildBus for %s augmented env var definitions from buildpack.envVarDefinitions interceptors',
            context
        );
    } catch (e) {
        debug(
            'BuildBus for %s errored calling buildpack.envVarDefinitions. Proceeding with base definitions',
            context
        );
    }
    return definitions;
}

module.exports = getEnvVarDefinitions;

/**
 * Defines the global settings of the project as a list of typed environment variables.
 * Includes a set of changes made to the environment variables in recent versions, to aid with migration and upgrades.
 *
 * `EnvVarDefinitions` are used by [`loadEnvironment()`]{@link http://pwastudio.io/pwa-buildpack/reference/buildpack-cli/load-env/#loadenvironmentdirorenv-logger}
 * to validate the currently defined values in the environment.
 *
 * `EnvVarDefinitions` are also used by [`createDotEnvFile()`]{@link http://pwastudio.io/pwa-buildpack/reference/buildpack-cli/create-env-file/#createdotenvfiledirectory-options}
 * to generate an extensively commented `.env` file for a project.
 *
 * @typedef {Object} EnvVarDefinitions
 * @property {EnvVarDefsSection[]} sections List of sections, or sub-lists of definitions grouped under a title.
 * @property {EnvVarDefsChange[]} changes List of changes, or objects describing a recent change to a definition.
 */

/**
 * A list of related definitions concerning a particular functional area.
 *
 * All defined variable names under a particular functional area should have the same prefix, to help namespace and organize configuration.
 * For instance, all variable names in the "Custom local origin" section begin with `CUSTOM_ORIGIN_`.
 *
 * @typedef {Object} EnvVarDefsSection
 * @property {String} name Title of the section, describing the functional area of the included variables.
 * @property {EnvVarDefinition[]} variables List of variable definitions.
 */

/**
 * A definition of an environment variable that will be used somewhere else in the project, in the backend and/or the frontend.
 *
 * Must define a name, type and description. Optionally, may define a `default` which is set implicitly, an `example` for documentation,
 * and/or an array of `choices` to limit the valid values.
 *
 * The recommended way to access the current environment values in build scripts and interceptors is through the
 * [Configuration]{@link http://pwastudio.io/pwa-buildpack/reference/buildpack-cli/load-env/#configuration-object}
 * object returned by [`loadEnvironment()`]{@link http://pwastudio.io/pwa-buildpack/reference/buildpack-cli/load-env/#loadenvironmentdirorenv-logger}.
 *
 * **Note:** Any build environment will have hundreds of environment variables _set_, most of which are unrelated to the build process.
 * Any environment variable during the build is accessible via `process.env` in NodeJS.
 * However, only the variables defined by `EnvVarDefinition` entries will be available in the frontend, via the [Webpack EnvironmentPlugin]{@link https://webpack.js.org/plugins/environment-plugin/}.
 *
 * @typedef {Object} EnvVarDefinition
 * @property {String} name Name of the environment variable. Must be in SCREAMING_SNAKE_CASE and contain only alphanumeric characters.
 * @property {String} type Type of the environment variable. Can be any type supported by the [envalid]{@link https://www.npmjs.com/package/envalid#validator-types} library.
 * @property {String} desc Human-readable description of what the environment variable does.
 * @property {Array} [choices] An array of acceptable answers. All values in the array must be of the type specified in `type`.
 * @property {String} default Default value if the variable is not set in the environment.
 * @property {String} example Example value which will be displayed in inline documentation in the `.env` file.
 */

/**
 * Describes a recent change to a particular environment variable.
 * Can indicate that the environment variable was _removed_ or _renamed_.
 * Change objects can log informative warnings to developers to help with migration.
 * They may also be used to make `loadEnvironment()` support the legacy name of a renamed variable.
 *
 * @typedef {Object} EnvVarDefsChange
 * @property {String} type `removed` or `renamed`
 * @property {String} name Name of the EnvVarDefinition that was recently changed. If the change is a rename, this must be the _old_ variable name.
 * @property {String} reason Reason given for the change. Will be logged as a warning.
 * @property {(String|number)} dateChanged Date that the change was released, in ISO-8601 format (or any format parseable by JavaScript `Date()`.)
 * @property {number} [warnForDays] Number of days after `dateChanged` to log a warning if the removed or renamed variable is still set in the environment. Default, and maximum, is 180 days.
 * @property {String} [update] New name of the variable. Required when the change is a rename.
 * @property {boolean} [supportLegacy] If the change is a rename, set this to `true` to support the old name (while logging a warning). If the old name is set and the new name is not, `loadEnvironment` will set the new variable name to the value of the old one.
 */
