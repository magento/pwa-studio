module.exports = targets => {
    const { Targetables } = require('@magento/pwa-buildpack');

    const targetables = Targetables.using(targets);

    targetables.setSpecialFeatures('esModules');

    targets.of('@magento/peregrine').talons.tap(talons => {
        talons.App.useApp.wrapWith(
            `@magento/venia-pwa-live-search/src/wrappers/wrapUseApp`
        );
        return talons;
    });
};
