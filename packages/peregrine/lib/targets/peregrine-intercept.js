const TalonWrapperConfig = require('./TalonWrapperConfig');

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
