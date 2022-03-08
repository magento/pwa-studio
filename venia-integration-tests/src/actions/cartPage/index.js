import {
    cartPageRoot,
    couponCodeSectionButton,
    giftCardSectionButton,
    giftOptionsSectionButton,
    kebabMenuButton,
    cartPageProductLink,
    kebabMenuEditButton,
    editMenuSizeButton,
    editMenuIncreaseQtyStepper,
    editMenuUpdateCartButton,
    cartPageCheckoutButton,
    productKebab,
    productListingProduct,
    productSectionRemoveFromCartButton,
    saveForLaterButton,
    shippingMethodEstimateButton,
    shippingMethodRegionField,
    shippingMethodRegionFieldId,
    shippingMethodPostCodeTextField,
    shippingMethodSubmitButton,
    shippingMethodSectionButton,
    shippingMethodRadios,
    shippingMethodCountrySelect,
    couponCodeCouponCodeTextField,
    couponCodeSubmitButton,
    couponCodeRemoveButton,
    giftCardCardTextField,
    giftCardCardApplyButton,
    giftCardRemoveButton,
    giftOptionsIncludeGiftReceiptCheckbox,
    giftOptionsIncludeGiftMessageCheckbox,
    giftOptionsIncludePrintedCardCheckbox,
    giftOptionsCardToInput,
    giftOptionsCardFromInput,
    giftOptionsCardMessageTextarea,
    giftOptionsEditGiftMessageButton,
    giftOptionsUpdateGiftMessageButton,
    cartPageDiscountSummaryDropdownButton
} from '../../fields/cartPage';
import { swatchRoot } from '../../fields/productPage';

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

export const toggleDiscountSection = () => {
    cy.get(cartPageDiscountSummaryDropdownButton).click();
};

/**
 * Utility to move a product from the cart page to a single wishlist
 */
export const moveProductFromCartToSingleWishlist = productName => {
    const itemToMove = cy.get(cartPageRoot).contains('li', productName);

    itemToMove.get(productKebab).click();

    itemToMove.get(saveForLaterButton).click();
};
/**
 * Utility to open a product's edit dialog from the cart page
 */
export const openProductKebabMenu = productName => {
    const itemToEdit = cy.get(cartPageRoot).contains('li', productName);

    itemToEdit.get(kebabMenuButton).click();
};

export const openProductEditMenu = productName => {
    const itemToEdit = cy.get(cartPageRoot).contains('li', productName);

    itemToEdit.get(kebabMenuEditButton).click();
};

/**
 * Utility to select a product's color in edit dialog
 */
export const editProductColor = color => {
    cy.get(`${swatchRoot}[title*="${color}"]`).click();
};
/**
 * Utility to select a product's size in edit dialog
 */
export const editProductSize = size => {
    cy.get(editMenuSizeButton)
        .contains('span', size)
        .click();
};
/**
 * Utility to increase a product's quantity in edit dialog
 */
export const increaseProductQuantity = () => {
    cy.get(editMenuIncreaseQtyStepper).click();
};
/**
 * Utility to submit product modifications on edit dialog
 */
export const clickOnUpdateCart = () => {
    cy.get(editMenuUpdateCartButton).click();
};
/**
 * Utility to go to checkout page from cart page
 */
export const goToCheckout = () => {
    cy.get(cartPageCheckoutButton).click();
};

/**
 * Utility to click on product image link from cart page
 */
export const clickProductImageLinkFromCart = () => {
    cy.get(cartPageProductLink).click();
};

/**
 * Utility to click on product link from cart page
 */
export const clickProductLinkFromCart = () => {
    cy.get(cartPageProductLink).click();
};

/**
 * Utility to remove product from Cart
 *
 * @param {String} productName product name
 */
export const removeProductFromCart = productName => {
    cy.get(productListingProduct)
        .contains(productListingProduct, productName)
        .find(productKebab)
        .click()
        .closest(productListingProduct)
        .find(productSectionRemoveFromCartButton)
        .click();
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
        cy.get(shippingMethodRegionFieldId)
            .should('not.be.disabled')
            .select(regionCode);
    } else if (region) {
        cy.get(shippingMethodRegionField)
            .should('not.be.disabled')
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
 * Utility function to remove Coupon Code from Cart Page
 */
export const removeCouponCodeFromCartPage = () => {
    cy.get(couponCodeRemoveButton).click();
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
 * Utility function to remove Gift Cards from Cart Page
 */
export const removeGiftCardsFromCartPage = () => {
    cy.get(giftCardRemoveButton).each($button => {
        cy.wrap($button).click();
    });
};

/**
 * Utility function to set Gift Options from Cart Page
 *
 * @param {Object} data gift options data
 * @param {Boolean} [data.shouldEdit] should click on edit button
 * @param {Boolean} [data.includeGiftReceipt] include gift receipt
 * @param {Boolean} [data.includeGiftMessage] include gift message
 * @param {Boolean} [data.includePrintedCard] include printed card
 * @param {String} [data.cardTo] card to
 * @param {String} [data.cardFrom] card from
 * @param {String} [data.cardMessage] card message
 */
export const setGiftOptionsFromCartPage = ({
    shouldEdit = false,
    includeGiftReceipt = false,
    includeGiftMessage = false,
    includePrintedCard = false,
    cardTo,
    cardFrom,
    cardMessage
}) => {
    if (shouldEdit) {
        cy.get(giftOptionsEditGiftMessageButton).click();
    }

    if (includeGiftReceipt) {
        cy.get(giftOptionsIncludeGiftReceiptCheckbox).check();
    } else {
        cy.get(giftOptionsIncludeGiftReceiptCheckbox).uncheck();
    }

    if (includeGiftMessage) {
        cy.get(giftOptionsIncludeGiftMessageCheckbox).check();

        if (cardTo) {
            cy.get(giftOptionsCardToInput)
                .clear()
                .type(cardTo);
        }

        if (cardFrom) {
            cy.get(giftOptionsCardFromInput)
                .clear()
                .type(cardFrom);
        }

        if (cardMessage) {
            cy.get(giftOptionsCardMessageTextarea)
                .clear()
                .type(cardMessage);
        }

        cy.get(giftOptionsUpdateGiftMessageButton).click();
    } else {
        cy.get(giftOptionsIncludeGiftMessageCheckbox).uncheck();
    }

    if (includePrintedCard) {
        cy.get(giftOptionsIncludePrintedCardCheckbox).check();
    } else {
        cy.get(giftOptionsIncludePrintedCardCheckbox).uncheck();
    }
};
