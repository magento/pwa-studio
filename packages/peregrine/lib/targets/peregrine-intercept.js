const path = require('path');

/**
 * @class TalonWrapperConfig
 * @classdesc A registry of Peregrine talons you can wrap custom code around.
 * An instance of this class is made available when you use Peregrine's
 * `talons` target.
 */
/**
 * This is the constructor for a TalonWrapperConfig object, which provides
 * the various wrappable talons for extensions.
 * 
 * @ignore
 * 
 * @param {function} addTransforms Callback function for adding transforms 
 */
function TalonWrapperConfig(addTransforms) {

    /**
     * Represents a talon file that can be wrapped by an extension.
     * 
     * @typedef Wrappable
     */
    const wrappable = (talonFile, exportName) => ({
        /**
         * @typedef {function} Wrappable.wrapWith
         * 
         * @param {String} wrapperModule The module to wrap the talon with
         */
        wrapWith: wrapperModule =>
            addTransforms({
                type: 'source',
                fileToTransform: path.join('./lib/talons/', talonFile),
                transformModule:
                    '@magento/pwa-buildpack/lib/WebpackTools/loaders/wrap-esm-loader',
                options: {
                    wrapperModule,
                    exportName
                }
            })
    });
    return {
        /**
         * Provides access to the talon used in Venia's ProductFullDetail UI component.
         *
         * @memberof TalonWrapperConfig
         */
        ProductFullDetail: {
            /**
             * @property {Wrappable} useProductFullDetail {@link Wrappable} object for the `useProductFullDetail()` talon
             */
            useProductFullDetail: wrappable(
                'ProductFullDetail/useProductFullDetail',
                'useProductFullDetail'
            )
        },
        /**
         * Provides access to the talon used in Venia's App UI component.
         * @memberof TalonWrapperConfig
         */
        App: {
            /**
             * @property {Wrappable} useApp {@link Wrappable} object for the `useApp()` talon
             */
            useApp: wrappable('App/useApp', 'useApp')
        }
    };
}

module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.specialFeatures.tap(featuresByModule => {
        featuresByModule['@magento/peregrine'] = {
            cssModules: true,
            esModules: true,
            graphQlQueries: true
        };
    });

    /**
     * Tap the low-level Buildpack target for wrapping _any_ frontend module.
     * Wrap the config object in a TalonWrapperConfig, which presents
     * higher-level targets for named and namespaced talons, instead of the
     * file paths directly.
     * Pass that higher-level config through `talons` interceptors, so they can
     * add wrappers for the talon modules without tapping the `transformModules`
     * config themselves.
     */
    builtins.transformModules.tap(addTransform => {
        const talonWrapperConfig = new TalonWrapperConfig(addTransform);

        targets.own.talons.call(talonWrapperConfig);
    });
};
