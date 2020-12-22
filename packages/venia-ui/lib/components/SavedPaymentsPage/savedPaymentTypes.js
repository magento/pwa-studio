/**
 * This file is augmented at build time using the @magento/venia-ui build
 * target "savedPaymentTypes", which allows third-party modules to add new saved payment component mappings.
 *
 * @see [SavedPayment definition object]{@link SavedPaymentDefinition}
 */
export default {};

/**
 * A payment definition object that describes a saved payment in your storefront.
 *
 * @typedef {Object} SavedPaymentDefinition
 * @property {string} paymentCode is use to map your payment
 * @property {string} importPath Resolvable path to the component the
 *   Route component will render
 *
 * @example <caption>A custom payment method</caption>
 * const myCustomSavedPayment = {
 *      paymentCode: 'cc',
 *      importPath: '@partner/module/path_to_your_component'
 * }
 */
