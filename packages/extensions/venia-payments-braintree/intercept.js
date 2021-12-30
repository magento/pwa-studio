module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');
    builtins.envVarDefinitions.tap(defs => {
        defs.sections.push({
            name: 'Braintree Token',
            variables: [
                {
                    name: 'CHECKOUT_BRAINTREE_TOKEN',
                    type: 'str',
                    desc:
                        "Specify a Braintree API token to direct the Venia storefront to communicate with your Braintree instance. You can find this value in Braintree's Control Panel under Settings > API Keys > Tokenization Keys.",
                    example: 'sandbox_8yrzsvtm_s2bg8fs563crhqzk'
                }
            ]
        });
        builtins.specialFeatures.tap(flags => {
            flags[targets.name] = {
                esModules: true,
                cssModules: true,
                graphqlQueries: true
            };
        });
    });

    const {
        checkoutPagePaymentTypes,
        savedPaymentTypes,
        editablePaymentTypes,
        summaryPagePaymentTypes
    } = targets.of('@magento/venia-ui');

    checkoutPagePaymentTypes.add({
        paymentCode: 'braintree',
        importPath:
            '@magento/venia-payments-braintree/src/components/creditCard'
    });

    savedPaymentTypes.add({
        paymentCode: 'braintree',
        importPath:
            '@magento/venia-payments-braintree/src/components/editCreditCard'
    });

    editablePaymentTypes.add({
        paymentCode: 'braintree',
        importPath:
            '@magento/venia-payments-braintree/src/components/savedCreditCard'
    });

    summaryPagePaymentTypes.add({
        paymentCode: 'braintree',
        importPath:
            '@magento/venia-payments-braintree/src/components/summary'
    });
};
