module.exports = targets => {
    const { specialFeatures } = targets.of('@magento/pwa-buildpack');
    specialFeatures.tap(flags => {
        /**
         *  Wee need to activate esModules, cssModules and GQL Queries to allow build pack to load our extension
         * {@link https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/#special-flags}.
         */
        flags[targets.name] = {
            esModules: true,
            cssModules: true,
            graphqlQueries: true
        };
    });

    const { checkoutPagePaymentTypes } = targets.of('@magento/venia-ui');
    checkoutPagePaymentTypes.tap(payments =>
        payments.add({
            paymentCode: 'custom_payment1',
            importPath:
                '@magento/multiple-payment-test/src/components/custom_payment1.js'
        })
    );

    checkoutPagePaymentTypes.tap(payments =>
    payments.add({
        paymentCode: 'custom_payment2',
        importPath:
            '@magento/multiple-payment-test/src/components/custom_payment2.js'
    }));
};
