/**
 * Implementation of our 'checkoutPagePaymentTypes' target. This will gather
 * PaymentMethod declarations { paymentCode, importPath } from all
 * interceptors, and then tap `builtins.transformModules` to inject a module
 * transform into the build which is configured to generate an object of modules
 * to be imported and then exported.
 *
 * An instance of this class is made available when you use VeniaUI's
 * `checkoutPagePaymentTypes` target.
 */
class CheckoutPagePaymentsList {
    /** @hideconstructor */
    constructor(venia) {
        const registry = this;
        this._methods = venia.esModuleObject({
            module:
                '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection.js',
            publish(targets) {
                targets.checkoutPagePaymentTypes.call(registry);
            }
        });
    }

    add({ paymentCode, importPath }) {
        this._methods.add(`import ${paymentCode} from '${importPath}'`);
    }
}

module.exports = CheckoutPagePaymentsList;
