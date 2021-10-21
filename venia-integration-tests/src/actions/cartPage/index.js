import {
    cartPageRoot,
    couponCodeSectionButton,
    giftCardSectionButton,
    giftOptionsSectionButton,
    kebabMenuButton,
    saveForLaterButton,
    shippingMethodEstimateButton,
    shippingMethodRegionField,
    shippingMethodPostCodeTextField,
    shippingMethodSubmitButton,
    shippingMethodSectionButton,
    shippingMethodRadios,
    shippingMethodCountrySelect,
    couponCodeCouponCodeTextField,
    couponCodeSubmitButton,
    giftCardCardTextField,
    giftCardCardApplyButton,
    giftOptionsIncludeGiftReceiptCheckbox,
    giftOptionsIncludePrintedCardCheckbox,
    giftOptionsCardMessageTextarea
} from '../../fields/cartPage';
import { defaultShippingMethods } from '../../fixtures/checkoutPage';

export const toggleShippingMethodSection = () => {
    cy.get(shippingMethodSectionButton).click();
};

export const toggleShippingMethodEstimate = () => {
    cy.get(shippingMethodEstimateButton).click();
};

export const toggleCouponCodeSection = () => {
    cy.get(couponCodeSectionButton).click();
};

export const toggleGiftCardSection = () => {
    cy.get(giftCardSectionButton).click();
};

export const toggleGiftOptionsSection = () => {
    cy.get(giftOptionsSectionButton).click();
};

/**
 * Utility to move a product from the cart page to a single wishlist
 */
export const moveProductFromCartToSingleWishlist = productName => {
    const itemToMove = cy.get(cartPageRoot).contains('li', productName);

    itemToMove.get(kebabMenuButton).click();

    itemToMove.get(saveForLaterButton).click();
};

/**
 * Utility function to estimate Shipping Method
 *
 * @param {Object} data address data
 * @param {String} [data.countryCode] country code
 * @param {String} [data.regionCode] region id
 * @param {String} [data.region] region text
 * @param {String} [data.postCode] postal code
 */
export const estimateShippingMethod = ({
    countryCode,
    regionCode,
    region,
    postCode
}) => {
    if (countryCode) {
        cy.get(shippingMethodCountrySelect).select(countryCode);
    }

    if (regionCode) {
        cy.get(shippingMethodRegionField).select(regionCode);
    } else if (region) {
        cy.get(shippingMethodRegionField)
            .clear()
            .type(region);
    }

    if (postCode) {
        cy.get(shippingMethodPostCodeTextField)
            .clear()
            .type(postCode);
    }

    cy.get(shippingMethodSubmitButton).click();
};

/**
 * Utility to select Shipping Method from Cart Page
 *
 * @param {String} [shippingMethodCode] Shipping Method's name
 */
export const selectShippingMethodFromCartPage = (
    shippingMethodCode = defaultShippingMethods.free.code
) => {
    cy.get(shippingMethodRadios)
        .filter(`[value*='${shippingMethodCode}']`)
        .check();
};

/**
 * Utility function to set Coupon Code from Cart Page
 *
 * @param {String} code coupon code
 */
export const setCouponCodeFromCartPage = code => {
    cy.get(couponCodeCouponCodeTextField)
        .clear()
        .type(code);

    cy.get(couponCodeSubmitButton).click();
};

/**
 * Utility function to set Gift Card from Cart Page
 *
 * @param {String} cardNumber gift card number
 */
export const setGiftCardFromCartPage = cardNumber => {
    cy.get(giftCardCardTextField)
        .clear()
        .type(cardNumber);

    cy.get(giftCardCardApplyButton).click();
};

/**
 * Utility function to set Gift Options from Cart Page
 *
 * @param {Object} data gift options data
 * @param {Boolean} [data.includeGiftReceipt] include gift receipt
 * @param {Boolean} [data.includePrintedCard] include printed card
 * @param {String} [data.cardMessage] card message
 */
export const setGiftOptionsFromCartPage = ({
    includeGiftReceipt = false,
    includePrintedCard = false,
    cardMessage
}) => {
    if (includeGiftReceipt) {
        cy.get(giftOptionsIncludeGiftReceiptCheckbox).check();
    } else {
        cy.get(giftOptionsIncludeGiftReceiptCheckbox).uncheck();
    }

    if (includePrintedCard) {
        cy.get(giftOptionsIncludePrintedCardCheckbox).check();
    } else {
        cy.get(giftOptionsIncludePrintedCardCheckbox).uncheck();
    }

    if (cardMessage) {
        cy.get(giftOptionsCardMessageTextarea)
            .clear()
            .type(cardMessage);
    }
};
