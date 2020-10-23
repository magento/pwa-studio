function makePaymentTarget(venia) {

    function addPayments(paymentObj, paymentList) {
        for (const payment of paymentList) {
            paymentObj.add(`${payment.code} from "${payment.path}"`);
        }
    }

    const payments = venia.esModuleObject(
        '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection.js',
        async ({paymentsList}, self) => {
            if(paymentsList !== undefined)
            {
                addPayments(self, await paymentsList.promise([]))
            }
        }
    );

    addPayments(payments, []);
}

module.exports = makePaymentTarget;
