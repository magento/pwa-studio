/**
 * Mappings for overwrites
 * example: [`@magento/venia-ui/lib/components/Main/main.js`]: './lib/components/Main/main.js'
 */
module.exports = componentOverride = {
    [`@magento/venia-ui/lib/components/CheckoutPage/BillingAddress/billingAddress.js`]: '@orienteed/defaultBillingAddress/src/components/CheckoutPage/BillingAddress/billingAddress.js',
    [`@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/creditCard.js`]: '@orienteed/defaultBillingAddress/src/components/CheckoutPage/PaymentInformation/creditCard.js',
    [`@magento/venia-ui/lib/components/AddressBookPage/addressCard.js`]: '@orienteed/defaultBillingAddress/src/components/AddressBookPage/addressCard.js'
};
