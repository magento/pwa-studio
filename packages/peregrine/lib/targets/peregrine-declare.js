/**
 * These targets are available for interception to modules which depend on `@magento/peregrine`.
 *
 * Their implementations are found in `./peregrine-intercept.js`.
 *
 */
module.exports = targets => {
    targets.declare({
        /**
         * Provides access to Peregrine talon wrappers.
         * 
         * This target collects requests to intercept and "wrap" individual Peregrine
         * talons in decorator functions. It is a convenience wrapper around the
         * `transformModules` target in `@magento/pwa-buildpack`, but instead of decorating
         * files, it exposes the talons as functions to wrap.
         * 
         * Use this target to run custom code whenever the application calls a
         * Peregrine talon.
         * You can also use this target to modify the behavior or output returned by
         * a talon.
         *
         * @typedef {talons}
         * @member {tapable.SyncHook}
         * 
         * @see [`talons.tap()`]{@link talons.tap}
         * @see [Intercept function signature]{@link talonInterceptFunction}
         *
         * @example <caption>Access the tapable object</caption>
         * const peregrineTargets = targets.of('@magento/peregrine');
         * const talonsTarget = peregrineTargets.talons;
         * 
         * @example <caption>Wrap the `useApp()` hook  with a logging extension</caption>
         * 
         * talonsTarget.tap(talons => {
         *   talons.App.useApp.wrapWith('@my-extensions/log-wrapper');
         * })
         */
        talons: new targets.types.Sync(['talons'])
    });
};

/** Type definitions related to: talons */

/**
 * The `tap()` function gives you access to the talon registry through a 
 * [callback function]{@link talonIntercept} you define in your project.
 * 
 * @function talons.tap
 * 
 * @param {talonInterceptFunction} intercept A callback function
 * 
 * @example
 * const talons = peregrineTargets.talons;
 * 
 * talons.tap(talons => {
 *   // Logic for wrapping specific talons
 * })
 */

/**
 * The talon intercept function is a callback defined in your intercept file.
 * It has access to the talon registry when passed into the
 * [`talons.tap()`]{@link talons.tap} function.
 * 
 * @callback talonInterceptFunction
 * @param {Peregrine/Targets.TalonWrapperConfig} talons Registry of talon namespaces, talons, and Sets of interceptors
 */
