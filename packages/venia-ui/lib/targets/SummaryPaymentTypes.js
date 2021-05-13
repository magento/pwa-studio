/**
 * Implementation of our 'summeryPagePaymentTypes' target. This will gather
 * SavedPaymentMethod declarations { paymentCode, importPath } from all
 * interceptors, and then tap `builtins.transformModules` to inject a module
 * transform into the build which is configured to generate an object of modules
 * to be imported and then exported.
 *
 * An instance of this class is made available when you use VeniaUI's
 * `summeryPagePaymentTypes` target.
 */
class SummaryPaymentTypes {
    /** @hideconstructor */
    constructor(venia) {
        const registry = this;
        this._methods = venia.esModuleObject({
            module:
                '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/summaryPaymentCollection.js',
            publish(targets) {
                targets.summeryPagePaymentTypes.call(registry);
            }
        });
    }

    add({ paymentCode, importPath }) {
        this._methods.add(`import ${paymentCode} from '${importPath}'`);
    }
}

module.exports = SummaryPaymentTypes;
