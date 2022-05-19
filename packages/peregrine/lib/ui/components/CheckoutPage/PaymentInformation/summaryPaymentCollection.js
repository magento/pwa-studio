/**
 * This file is augmented at build time using the @magento/venia-ui build
 * target "summaryPagePaymentTypes", which allows third-party modules to
 * add new payment component mappings for the checkout page.
 *
 * @see [Payment definition object]{@link PaymentDefinition}
 */
export default {};

/**
 * A payment definition object that describes a payment infor what be show on summary page.
 *
 * @typedef {Object} PaymentDefinition
 * @property {string} paymentCode is use to map your payment
 * @property {string} importPath Resolvable path to the component the
 *   Route component will render
 *
 * @example <caption>A custom payment method</caption>
 * const myCustomPayment = {
 *      paymentCode: 'cc',
 *      importPath: '@partner/module/path_to_your_component'
 * }
 */
