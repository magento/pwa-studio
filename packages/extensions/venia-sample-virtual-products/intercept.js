module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(features => {
        features[targets.name] = {
            cssModules: true,
            esModules: true,
            graphqlQueries: true
        };
    });

    const { talons } = targets.of('@magento/peregrine');

    talons.tap(hooks => {
        const useCategory = hooks.RootComponents.Category.useCategory;
        useCategory.wrapWith(
            '@magento/venia-sample-virtual-products/src/wrapUseCategory'
        );
    });

    const { categoryListProductAttributes } = targets.of('@magento/venia-ui');
    categoryListProductAttributes.tap(target => {
        target.insertAfterJSX({
            matcher: 'Link className={classes.name}',
            importStatement: `import SubTypeAttribute from '@magento/venia-sample-virtual-products/src/components/SubTypeAttribute'`
        });
    });
};
