
module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');
    builtins.specialFeatures.tap(features => {
        features[targets.name] = { esModules: true, cssModules: true };
    });

    targets.of('@magento/venia-ui').routes.tap(routes => {
        if (process.env.B2BSTORE_VERSION === 'PREMIUM') {
            routes.push(
                {
                    name: 'BuyLaterNotes',
                    pattern: '/mpsavecart',
                    path: '@orienteed/buyLaterNotes/components/SavedCarts'
                },
                {
                    name: 'BuyLaterNotes',
                    pattern: '/mpsavecart/cart/share/id/:token',
                    path: '@orienteed/buyLaterNotes/components/ShareCart'
                }
            );
        }
        return routes;
    });

    const peregrineTargets = targets.of('@magento/peregrine');
    const talonsTarget = peregrineTargets.talons;
    if (process.env.B2BSTORE_VERSION === 'PREMIUM') {
        talonsTarget.tap(talonWrapperConfig => {
            talonWrapperConfig.AccountMenu.useAccountMenuItems.wrapWith(
                '@orienteed/buyLaterNotes/talons/useAccountMenuItems'
            );
        });
    }
};
// }

