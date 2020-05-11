/**
 * These targets are available for interception to modules which depend on `@magento/peregrine`.
 *
 * Their implementations are found in `./peregrine-intercept.js`.
 *
 * @module Peregrine/Targets
 */
module.exports = targets => {
    targets.declare({
        /**
         * @callback talonIntercept
         * @param {Peregrine/Targets.TalonWrapperConfig} talons - Registry of talon namespaces, talons, and Sets of interceptors
         * @returns {undefined} - Interceptors of `talons` should add to the
         * sets on passed TalonWrapperConfig instance. Any returned value will
         * be ignored.
         */

        /**
         * Collects requests to intercept and "wrap" individual Peregrine
         * talons in decorator functions. Use it to add your own code to run
         * when Peregrine talons are invoked, and/or to modify the behavior and
         * output of those talons.
         *
         * This target is a convenience wrapper around the
         * `@magento/pwa-buildpack` target `transformModules`. That target uses
         * filenames, which are not guaranteed to be semantically versioned or
         * to be readable APIs.
         * This target publishes talons as functions to wrap, rather than as
         * files to decorate.
         *
         * @type {tapable.SyncHook}
         * @param {talonIntercept}
         *
         * @example <caption>Log whenever the `useApp()` hook runs.</caption>
         * targets.of('@magento/peregrine').talons.tap(talons => {
         *   talons.App.useApp.wrapWith('./log-wrapper');
         * })
         * // log-wrapper.js:
         * export default function wrapUseApp(original) {
         *   return function useApp(...args) {
         *     console.log('calling useApp with', ...args);
         *     return original(...args);
         *   }
         * }
         */
        talons: new targets.types.Sync(['talons'])
    });
};
