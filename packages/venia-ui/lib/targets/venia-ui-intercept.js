/**
 * @module VeniaUI/Targets
 */
const { Targetables } = require('@magento/pwa-buildpack');
const CategoryListProductAttributes = require('./CategoryListProductAttributes');
const RichContentRendererList = require('./RichContentRendererList');
const makeRoutesTarget = require('./makeRoutesTarget');
const CheckoutPagePaymentsList = require('./CheckoutPagePaymentsList');
const SavedPaymentTypes = require('./SavedPaymentTypes');

module.exports = veniaTargets => {
    const venia = Targetables.using(veniaTargets);

    venia.setSpecialFeatures(
        'cssModules',
        'esModules',
        'graphqlQueries',
        'rootComponents',
        'upward',
        'i18n'
    );

    makeRoutesTarget(venia);

    const renderers = new RichContentRendererList(venia);

    renderers.add({
        componentName: 'PlainHtmlRenderer',
        importPath: './plainHtmlRenderer'
    });

    new CheckoutPagePaymentsList(venia);
    new SavedPaymentTypes(venia);
    new CategoryListProductAttributes(venia);
};
