/**
 * These targets are available for interception to modules which depend on `@magento/peregrine`.
 *
 * Their implementations are found in `./peregrine-intercept.js`.
 *
 */
module.exports = targets => {
    targets.declare({
        /**
         * Provides access to Peregrine React hooks.
         *
         * This target collects requests to intercept and "wrap" individual Peregrine
         * hooks in decorator functions.
         *
         * Use this target to run custom code whenever the application calls a
         * Peregrine hook.
         * You can also use this target to modify the behavior or output returned by
         * a hook.
         *
         *
         * @member {tapable.AsyncSeriesHook}
         *
         * @see [Intercept function signature]{@link hookInterceptFunction}
         *
         * @example <caption>Access the tapable object</caption>
         * const peregrineTargets = targets.of('@magento/peregrine');
         * const hooksTarget = peregrineTargets.hooks;
         *
         * @example <caption>Wrap the `useAwaitQuery()` hook  with a logging extension</caption>
         *
         * hooksTargets.tap( => {
         *   hook.useAwaitQuery.wrapWith('@my-extensions/log-wrapper');
         * })
         */
        hooks: new targets.types.AsyncSeries(['hooks']),
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
         * @member {tapable.AsyncSeriesHook}
         *
         * @see [Intercept function signature]{@link hookInterceptFunction}
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
        talons: new targets.types.AsyncSeries(['talons'])
    });
};

/** Type definitions related to: talons */

/**
 * Intercept function signature for the `talons` and `hooks` targets.
 *
 * Interceptors of `hooks` should call `wrapWith` on the individual hooks in
 * the provided [`HookInterceptorSet` object]{@link
 * http://pwastudio.io/peregrine/reference/targets/wrappable-talons}.
 *
 * @callback hookInterceptFunction
 * @param {HookInterceptorSet} hookInterceptors Registry of wrappable hook namespaces
 */
