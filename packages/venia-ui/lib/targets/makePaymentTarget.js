function makePaymentTarget(venia) {
    const payments = venia.esModuleObject(
        '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection.js'
    );
    payments.add('braintree from "./creditCard"');
}

module.exports = makePaymentTarget;
