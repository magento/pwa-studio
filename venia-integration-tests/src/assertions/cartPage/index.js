import {
    productKebab,
    cartPageRoot,
    cartPageProductOption,
    cartPageProductQuantity,
    cartPageProductPrice,
    cartPageProductImageLink,
    productListingProductName,
    cartPagePriceSummaryDiscountSummary,
    cartPagePriceSummaryGiftCardSummary,
    cartPageHeading,
    cartPagePriceSummarySubtotalLabel,
    cartPagePriceSummaryTotalLabel,
    cartPageCheckoutButton,
    cartPagePriceAdjustmentSectionTitleButtons,
    shippingMethodSectionButton,
    shippingMethodSection,
    couponCodeSectionButton,
    couponCodeForm,
    couponCodeSubmitButton,
    giftOptionsSectionButton,
    giftOptionsForm,
    giftCardSectionButton,
    giftCardsForm,
    cartPagePriceSummaryTotalValue,
    cartPagePriceSummarySubtotalValue,
    giftOptionsSection,
    giftOptionsGiftMessageResult,
    giftOptionsIncludeGiftReceiptCheckbox,
    giftOptionsIncludeGiftMessageCheckbox,
    giftOptionsIncludePrintedCardCheckbox,
    giftOptionsCardToInput,
    giftOptionsCardFromInput,
    giftOptionsCardMessageTextarea,
    cartPageDiscountSummaryIndividualDiscount
} from '../../fields/cartPage';
import { validateLanguage } from '../../utils/language-test-utils';

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

/**
 * Utility function to assert CartPage text is in correct language (french or english)
 * @param {String} language --language to validate (ISO639 codes only, eg. "fra,eng")
 */
export const assertCartPageTextLanguage = language => {
    const textToValidate = [];
    cy.get(cartPageHeading).then($heading =>
        textToValidate.push($heading.text())
    );
    cy.get(cartPagePriceSummarySubtotalLabel).then($label =>
        textToValidate.push($label.text())
    );
    cy.get(cartPagePriceSummaryTotalLabel).then($label =>
        textToValidate.push($label.text())
    );
    cy.get(cartPageCheckoutButton).then($button =>
        textToValidate.push($button.text())
    );
    cy.get(cartPagePriceAdjustmentSectionTitleButtons).then($buttons =>
        textToValidate.push($buttons.text())
    );
    cy.get(shippingMethodSectionButton).click();
    cy.get(shippingMethodSection).within(() => {
        cy.get('p').then($p => textToValidate.push($p.text()));
        cy.get('button').then($button => textToValidate.push($button.text()));
    });
    cy.get(couponCodeSectionButton).click();
    cy.get(couponCodeForm).within(() => {
        cy.get('label').then($label => textToValidate.push($label.text()));
    });
    cy.get(couponCodeSubmitButton).then($button =>
        textToValidate.push($button.text())
    );
    cy.get(giftCardSectionButton).click();
    cy.get(giftCardsForm).within(() => {
        cy.get('label').then($label => textToValidate.push($label.text()));
        cy.get('button').then($button => textToValidate.push($button.text()));
    });

    cy.get(giftOptionsSectionButton).click();
    cy.get(giftOptionsForm).within(() => {
        cy.get('label').then($label => textToValidate.push($label.text()));
        expect(validateLanguage(textToValidate.join(','), language)).to.be.true;
    });
};

/**
 * Utility function to assert products in CartPage displays correct currency.
 *
 * @param {String} currency -- currency code to validate
 */
export const assertCartPageHasCurrency = currency => {
    const currencySymbolMap = {
        USD: '$',
        EUR: '€'
    };
    cy.get(cartPagePriceSummarySubtotalValue).should(
        'contain',
        currencySymbolMap[currency]
    );
    cy.get(cartPagePriceSummaryTotalValue).should(
        'contain',
        currencySymbolMap[currency]
    );
    cy.get(cartPageProductPrice).should('contain', currencySymbolMap[currency]);
};

/*
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
 * Utility function to assert product in Cart Page displays correct image.
 *
 * @param {String} src -- fragment of image src
 * @param {Number} index -- index of product in MiniCart
 */
export const assertProductImageDisplayedInCartPage = (src, index) => {
    cy.get(cartPageProductImageLink)
        .filter(':odd')
        .eq(index)
        .should('have.attr', 'src')
        .should('contain', src);
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
