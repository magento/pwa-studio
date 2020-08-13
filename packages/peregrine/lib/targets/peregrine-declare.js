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
         * talons in decorator functions.
         *
         * Use this target to run custom code whenever the application calls a
         * Peregrine talon.
         * You can also use this target to modify the behavior or output returned by
         * a talon.
         *
         *
         * @member {tapable.SyncHook}
         *
         * @see [list of wrappable talons][]
         *
         * @see [Intercept function signature]{@link talonInterceptFunction}
         *
         * @example <caption>Access the tapable object</caption>
         * const peregrineTargets = targets.of('@magento/peregrine');
         * const talonsTarget = peregrineTargets.talons;
         *
         * @example <caption>Wrap the `useApp()` hook  with a logging extension</caption>
         *
         * talonsTarget.tap(talonWrapperConfig => {
         *   talonWrapperConfig.App.useApp.wrapWith('@my-extensions/log-wrapper');
         * })
         */
        talons: new targets.types.Sync(['talons'])
    });
};

/** Type definitions related to: talons */

/**
 * Intercept function signature for the `talons` target.
 *
 * Interceptors of `talons` should call `wrapWith` on the individual talons in the provided [`TalonWrapperConfig` object]{@link http://pwastudio.io/peregrine/reference/targets/wrappable-talons}.
 *
 * @callback talonInterceptFunction
 * @param {TalonWrapperConfig} talonWrapperConfig Registry of wrappable talon namespaces, talons, and interceptor sets
 */
