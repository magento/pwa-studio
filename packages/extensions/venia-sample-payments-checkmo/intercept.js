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

    const {
        checkoutPagePaymentTypes,
        editablePaymentTypes,
        summaryPagePaymentTypes
    } = targets.of('@magento/venia-ui');
    checkoutPagePaymentTypes.tap(payments =>
        payments.add({
            paymentCode: 'checkmo',
            importPath:
                '@magento/venia-sample-payments-checkmo/src/components/checkmo.js'
        })
    );
    editablePaymentTypes.tap(editablePaymentTypes => {
        editablePaymentTypes.add({
            paymentCode: 'checkmo',
            importPath:
                '@magento/venia-sample-payments-checkmo/src/components/edit.js'
        });
    });
    summaryPagePaymentTypes.tap(paymentSummaries =>
        paymentSummaries.add({
            paymentCode: 'checkmo',
            importPath:
                '@magento/venia-sample-payments-checkmo/src/components/summary.js'
        })
    );
};
