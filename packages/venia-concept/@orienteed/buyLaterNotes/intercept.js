module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');
    process.env.B2BSTORE_VERSION === 'PREMIUM' &&
        builtins.specialFeatures.tap(features => {
            features[targets.name] = { esModules: true, cssModules: true };
        });

    process.env.B2BSTORE_VERSION === 'PREMIUM' &&
        targets.of('@magento/venia-ui').routes.tap(routes => {
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

            return routes;
        });
};
