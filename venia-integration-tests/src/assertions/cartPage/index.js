import {
    productKebab,
    cartPageRoot,
    cartPageProductOption,
    cartPageProductQuantity,
    cartPageProductPrice,
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
    cartPagePriceSummarySubtotalValue
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
 * Utility function to assert CartPage text is in correct language (french or english)
 * @param {String} language language to validate (ISO639 codes only, eg. "fra,eng")
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
 * @param {String} currency currency code to validate
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
