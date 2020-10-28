/**
 * @module VeniaUI/Targets
 */
const { Targetables } = require('@magento/pwa-buildpack');
const RichContentRendererList = require('./RichContentRendererList');
const makeRoutesTarget = require('./makeRoutesTarget');
const PaymentMethodList = require('./PaymentMethodList');

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

    const paymentMethodList = new PaymentMethodList(venia);
    paymentMethodList.add({
        paymentCode: 'braintree',
        importPath:
            '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/creditCard'
    });
};
