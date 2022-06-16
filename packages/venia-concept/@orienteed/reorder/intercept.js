const componentOverrideMapping = require('./componentOverrideMapping');
const moduleOverridePlugin = require('./moduleOverrideWebpackPlugin');

module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');
    builtins.specialFeatures.tap(features => {
        features[targets.name] = { esModules: true, cssModules: true };
    });
    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverridePlugin(componentOverrideMapping).apply(compiler);
    });
    const peregrineTargets = targets.of('@magento/peregrine');
    const talonsTarget = peregrineTargets.talons;
    talonsTarget.tap(talonWrapperConfig => {
        talonWrapperConfig.CheckoutPage.useCheckoutPage.wrapWith(require.resolve('./talons/useCheckoutPage'));
        talonWrapperConfig.OrderHistoryPage.useOrderHistoryPage.wrapWith(
            require.resolve('./talons/useOrderHistoryPage')
        );
    });
};
