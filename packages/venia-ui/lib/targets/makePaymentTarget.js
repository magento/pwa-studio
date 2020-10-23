function makePaymentTarget(venia) {
    const payments = venia.esModuleObject(
        '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodByCode.js'
    );
    payments.add('braintree from "./creditCard"');
}

module.exports = makePaymentTarget;
