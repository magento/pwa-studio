/**
 * @module VeniaUI/Targets
 */
const { Targetables } = require('@magento/pwa-buildpack');
const CategoryListProductAttributes = require('./ui/CategoryListProductAttributes');
const RichContentRendererList = require('./ui/RichContentRendererList');
const makeRoutesTarget = require('./ui/makeRoutesTarget');
const CheckoutPagePaymentsList = require('./ui/CheckoutPagePaymentsList');
const SavedPaymentTypes = require('./ui/SavedPaymentTypes');
const EditablePaymentTypes = require('./ui/EditablePaymentTypes');
const SummaryPaymentTypes = require('./ui/SummaryPaymentTypes');
const RootShimmerTypes = require('./ui/RootShimmerTypes');

const path = require('path');
const HookInterceptorSet = require('./HookInterceptorSet');

const packageDir = path.resolve(__dirname, '../../');

module.exports = targets => {
    const peregrineTargets = Targetables.using(targets);

    peregrineTargets.setSpecialFeatures(
        'cssModules',
        'esModules',
        'graphqlQueries',
        'rootComponents',
        'upward',
        'i18n'
    );

    makeRoutesTarget(peregrineTargets);

    const renderers = new RichContentRendererList(peregrineTargets);

    renderers.add({
        componentName: 'PlainHtmlRenderer',
        importPath: './plainHtmlRenderer'
    });

    const checkoutPagePaymentsList = new CheckoutPagePaymentsList(
        peregrineTargets
    );
    checkoutPagePaymentsList.add({
        paymentCode: 'braintree',
        importPath:
            '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/creditCard'
    });

    const savedPaymentTypes = new SavedPaymentTypes(peregrineTargets);
    savedPaymentTypes.add({
        paymentCode: 'braintree',
        importPath:
            '@magento/venia-ui/lib/components/SavedPaymentsPage/creditCard'
    });

    const editablePayments = new EditablePaymentTypes(peregrineTargets);
    editablePayments.add({
        paymentCode: 'braintree',
        importPath:
            '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/editCard'
    });

    const summaryPagePaymentTypes = new SummaryPaymentTypes(peregrineTargets);
    summaryPagePaymentTypes.add({
        paymentCode: 'braintree',
        importPath:
            '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/braintreeSummary'
    });

    new CategoryListProductAttributes(peregrineTargets);

    const rootShimmerTypes = new RootShimmerTypes(peregrineTargets);
    rootShimmerTypes.add({
        shimmerType: 'CATEGORY_SHIMMER',
        importPath:
            '@magento/venia-ui/lib/RootComponents/Category/categoryContent.shimmer'
    });

    /**
     * Tap the low-level Buildpack target for wrapping _any_ frontend module.
     * Wrap the config object in a HookInterceptorSet, which presents
     * higher-level targets for named and namespaced hooks, instead of the file
     * paths directly. Pass that higher-level config through `talons` and
     * `hooks` interceptors, so they can add wrappers for the hook modules
     * without tapping the `transformModules` config themselves.
     */
    const publicHookSets = ['hooks', 'talons'];
    // Waits to build API until `transformModules` target runs.
    peregrineTargets._builtins.transformModules.tapPromise(
        async addTransform => {
            await Promise.all(
                // Run the same setup routine for "hooks" and "talons"
                publicHookSets.map(async name => {
                    const hookInterceptors = new HookInterceptorSet(
                        path.resolve(packageDir, 'lib', name),
                        targets.own[name]
                    );
                    // Run any bound interceptors!
                    await hookInterceptors.runAll();
                    // Get out the generated transformModules and add each one.
                    hookInterceptors.allModules.forEach(targetable =>
                        targetable.flush().forEach(addTransform)
                    );
                })
            );
        }
    );
};
