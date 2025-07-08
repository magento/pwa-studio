module.exports = targets => {
    const { specialFeatures } = targets.of('@magento/pwa-buildpack');
    specialFeatures.tap(flags => {
        /**
         *  Wee need to activate esModules, GQL Queries and deactivate cssModules to allow build pack to load our extension
         * {@link https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/#special-flags}.
         */
        flags[targets.name] = {
            esModules: true,
            cssModules: false,
            graphqlQueries: true
        };
    });

    targets.of('@magento/peregrine').talons.tap(talons => {
        talons.App.useApp.wrapWith(
            `@magento/venia-pwa-live-search/src/wrappers/wrapUseApp`
        );
        return talons;
    });
};
