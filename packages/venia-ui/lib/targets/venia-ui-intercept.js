/**
 * @module VeniaUI/Targets
 */
const { Targetables } = require('@magento/pwa-buildpack');
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

    const checkoutPagePaymentsList = new CheckoutPagePaymentsList(venia);
    checkoutPagePaymentsList.add({
        paymentCode: 'braintree',
        importPath:
            '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/creditCard'
    });

    const savedPaymentTypes = new SavedPaymentTypes(venia);
    savedPaymentTypes.add({
        paymentCode: 'braintree',
        importPath:
            '@magento/venia-ui/lib/components/SavedPaymentsPage/creditCard'
    });
};
