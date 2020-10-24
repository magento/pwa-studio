class PaymentMethodList {
    /** @hideconstructor */
    constructor(venia) {
        const registry = this;
        this._methods = venia.esModuleObject({
            module: '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection.js',
            publish(targets) {
                targets.payments.call(registry);
            }
        });
    }

    add({paymentCode, importPath}) {
        this._methods.add(`import ${paymentCode} from '${importPath}'`);
    }
}

module.exports = PaymentMethodList;
