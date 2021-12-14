import {
    productKebab,
    cartPageRoot,
    cartPageProductOption,
    cartPageProductQuantity,
    cartPageProductPrice,
    productListingProductName,
    cartPagePriceSummaryDiscountSummary,
    cartPagePriceSummaryGiftCardSummary,
    giftOptionsSection,
    giftOptionsGiftMessageResult,
    giftOptionsIncludeGiftReceiptCheckbox,
    giftOptionsIncludeGiftMessageCheckbox,
    giftOptionsIncludePrintedCardCheckbox,
    giftOptionsCardToInput,
    giftOptionsCardFromInput,
    giftOptionsCardMessageTextarea
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
 * Utility function to assert Gift Options Section is not available
 */
export const assertNoGiftOptionsSection = () => {
    cy.get(giftOptionsSection).should('not.exist');
};

/**
 * Utility function to assert Gift Message form is available
 */
export const assertGiftMessage = () => {
    cy.get(giftOptionsCardToInput).should('exist');
    cy.get(giftOptionsCardFromInput).should('exist');
    cy.get(giftOptionsCardMessageTextarea).should('exist');
};

/**
 * Utility function to assert Gift Receipt checkbox is not available
 */
export const assertNoGiftReceipt = () => {
    cy.get(giftOptionsIncludeGiftReceiptCheckbox).should('not.exist');
};

/**
 * Utility function to assert Gift Receipt checkbox is available
 */
export const assertGiftReceipt = () => {
    cy.get(giftOptionsIncludeGiftReceiptCheckbox).should('exist');
};

/**
 * Utility function to assert Printed Card checkbox is not available
 */
export const assertNoPrintedCard = () => {
    cy.get(giftOptionsIncludePrintedCardCheckbox).should('not.exist');
};

/**
 * Utility function to assert Printed Card checkbox is available
 */
export const assertPrintedCard = () => {
    cy.get(giftOptionsIncludePrintedCardCheckbox).should('exist');
};

/**
 * Utility function assert Gift Options from Cart
 *
 * @param {Object} data gift options data
 * @param {Boolean} [data.includeGiftReceipt] include gift receipt
 * @param {Boolean} [data.includeGiftMessage] include gift message
 * @param {Boolean} [data.includePrintedCard] include printed card
 * @param {String} [data.cardTo] card to
 * @param {String} [data.cardFrom] card from
 * @param {String} [data.cardMessage] card message
 */
export const assertCartGiftOptions = ({
    includeGiftReceipt = null,
    includeGiftMessage = null,
    includePrintedCard = null,
    cardTo,
    cardFrom,
    cardMessage
}) => {
    if (includeGiftReceipt !== null) {
        if (includeGiftReceipt) {
            cy.get(giftOptionsIncludeGiftReceiptCheckbox)
                .should('exist')
                .and('be.checked');
        } else {
            cy.get(giftOptionsIncludeGiftReceiptCheckbox)
                .should('exist')
                .and('not.be.checked');
        }
    }

    if (includeGiftMessage !== null) {
        if (includeGiftMessage) {
            cy.get(giftOptionsIncludeGiftMessageCheckbox)
                .should('exist')
                .and('be.checked');

            if (cardTo) {
                cy.get(giftOptionsGiftMessageResult)
                    .should('exist')
                    .and('contain', cardTo);
            }

            if (cardFrom) {
                cy.get(giftOptionsGiftMessageResult)
                    .should('exist')
                    .and('contain', cardFrom);
            }

            if (cardMessage) {
                cy.get(giftOptionsGiftMessageResult)
                    .should('exist')
                    .and('contain', cardMessage);
            }
        } else {
            cy.get(giftOptionsIncludeGiftMessageCheckbox)
                .should('exist')
                .and('not.be.checked');

            if (cardTo) {
                cy.get(giftOptionsCardToInput)
                    .should('exist')
                    .and('contain.value', cardTo);
            }

            if (cardFrom) {
                cy.get(giftOptionsCardFromInput)
                    .should('exist')
                    .and('contain.value', cardFrom);
            }

            if (cardMessage) {
                cy.get(giftOptionsCardMessageTextarea)
                    .should('exist')
                    .and('contain.value', cardMessage);
            }
        }
    }

    if (includePrintedCard !== null) {
        if (includePrintedCard) {
            cy.get(giftOptionsIncludePrintedCardCheckbox)
                .should('exist')
                .and('be.checked');
        } else {
            cy.get(giftOptionsIncludePrintedCardCheckbox)
                .should('exist')
                .and('not.be.checked');
        }
    }
};
