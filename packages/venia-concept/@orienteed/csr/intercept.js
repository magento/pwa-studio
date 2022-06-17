module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.specialFeatures.tap(features => {
        features[targets.name] = {
            esModules: true,
            cssModules: true,
            i18n: true,
            graphqlQueries: true
        };
    });

    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push({
            name: 'Support',
            pattern: '/support',
            path: '@orienteed/csr/src/components/SupportPage'
        });
        return routes;
    });

    // Override useAccountMenuItems talon
    const peregrineTargets = targets.of('@magento/peregrine');
    const talonsTarget = peregrineTargets.talons;
    talonsTarget.tap(talonWrapperConfig => {
        talonWrapperConfig.AccountMenu.useAccountMenuItems.wrapWith('@orienteed/csr/src/talons/useAccountMenuItems.js');
    });
};
