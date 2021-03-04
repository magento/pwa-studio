module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(features => {
        features[targets.name] = {
            esModules: true,
            graphqlQueries: true
        };
    });

    const { talons } = targets.of('@magento/peregrine');

    talons.tap(hooks => {
        const useCategory = hooks.RootComponents.Category.useCategory;
        useCategory.wrapWith(
            '@magento/venia-virtual-products/src/wrapUseCategory'
        );
    });
};
