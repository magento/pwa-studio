import {
    productKebab,
    cartPageRoot,
    cartPageProductOption,
    cartPageProductQuantity,
    cartPageProductPrice,
    productListingProductName,
    cartPagePriceSummaryDiscountSummary,
    cartPagePriceSummaryGiftCardSummary,
    cartPageDiscountSummaryIndividualDiscount
} from '../../fields/cartPage';

/**
 * Utility function to assert Product is in Cart Page
 *
 * @param {String} name Product's name
 */
export const assertProductInCartPage = name => {
    cy.get(productListingProductName).should('contain', name);
};

export const assertKebabMenuExists = productName => {
    const itemToCheck = cy.get(cartPageRoot).contains('li', productName);

    itemToCheck.get(productKebab).should('exist');
};

export const assertUpdatedProductColorExists = (productName, color) => {
    const itemToCheck = cy.get(cartPageRoot).contains('li', productName);

    itemToCheck.get(cartPageProductOption).should('contain', color);
};

export const assertUpdatedProductSizeExists = (productName, size) => {
    const itemToCheck = cy.get(cartPageRoot).contains('li', productName);

    itemToCheck.get(cartPageProductOption).should('contain', size);
};

export const assertUpdatedProductQuantityExists = (productName, qty) => {
    const itemToCheck = cy.get(cartPageRoot).contains('li', productName);

    itemToCheck.get(cartPageProductQuantity).should('have.value', qty);
};

export const assertUpdatedProductPriceExists = (productName, price) => {
    const itemToCheck = cy.get(cartPageRoot).contains('li', productName);

    itemToCheck
        .get(cartPageProductPrice)
        .contains('span', price)
        .should('exist');
    cy.get(productListingProductName).should('contain', name);
};

/**
 * Utility function to assert a Coupon Code is applied
 */
export const assertAppliedCouponCodeInCartPage = () => {
    cy.get(cartPagePriceSummaryDiscountSummary).should('exist');
};

/**
 * Utility function to assert no Coupon Code is applied
 */
export const assertNoCouponCodeInCartPage = () => {
    cy.get(cartPagePriceSummaryDiscountSummary).should('not.exist');
};

/**
 * Utility function to assert a Gift Card is applied
 */
export const assertAppliedGiftCardInCartPage = () => {
    cy.get(cartPagePriceSummaryGiftCardSummary).should('exist');
};

/**
 * Utility function to assert no Gift Cards are applied
 */
export const assertNoGiftCardInCartPage = () => {
    cy.get(cartPagePriceSummaryGiftCardSummary).should('not.exist');
};

/**
 * Utility function to assert discount summary exists
 */
export const assertDiscountSummaryInCartPage = () => {
    cy.get(cartPagePriceSummaryDiscountSummary).should('exist');
};

/**
 * Utility function to assert individual discount summary exists
 */
export const assertDiscountSummaryIndividualDiscountInCartPage = () => {
    cy.get(cartPageDiscountSummaryIndividualDiscount).should('exist');
};

/**
 * Utility function to assert individual discount summary not exist
 */
export const assertDiscountSummaryIndividualDiscountNotInCartPage = () => {
    cy.get(cartPageDiscountSummaryIndividualDiscount).should('not.exist');
};

/**
 * Utility function to assert individual discount summary exists
 */
export const assertDiscountSummaryIndividualDiscountVisibleInCartPage = () => {
    cy.get(cartPageDiscountSummaryIndividualDiscount).should('be.visible');
};

/**
 * Utility function to assert individual discount summary not exist
 */
export const assertDiscountSummaryIndividualDiscountNotVisibleInCartPage = () => {
    cy.get(cartPageDiscountSummaryIndividualDiscount).should('not.be.visible');
};

/**
 * Utility function to specific individual discount exists
 */
export const assertIndividualDiscount = (discountName, amount = 0) => {
    const discountToCheck = cy
        .get(cartPageDiscountSummaryIndividualDiscount)
        .contains('li', discountName);
    if (amount > 0) {
        discountToCheck.contains('span', amount).should('exist');
    }
};
