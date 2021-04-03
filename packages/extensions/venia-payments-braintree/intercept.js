module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(features => {
        /**{@link https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/#special-flags}. */
        features[targets.name] = {
            cssModules: true,
            esModules: true,
            graphqlQueries: true
        };
    });

    const { checkoutPagePaymentTypes } = targets.of('@magento/venia-ui');
    checkoutPagePaymentTypes.tap(payments =>
        payments.add({
          paymentCode: 'braintree',
          importPath:
          '@magento/venia-payments-braintree/src/components/creditCard.js'
        })
    );

    const { savedPaymentTypes } = targets.of('@magento/venia-ui');
    savedPaymentTypes.tap(payments =>
        payments.add({
            paymentCode: 'braintree',
            importPath:
                '@magento/venia-payments-braintree/src/components/SavedPayment/creditCard.js'
        })
    );
};
