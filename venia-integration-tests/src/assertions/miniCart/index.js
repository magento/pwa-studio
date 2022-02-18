import { validateLanguage } from '../../utils/language-test-utils';
import {
    guestElementSelector,
    miniCartProductList,
    miniCartEmptyMessage,
    miniCartTotalQuantity,
    miniCartSubtotalPriceLabel,
    miniCartSubtotalPrice,
    miniCartCheckoutButton,
    miniCartEditCartButton,
    miniCartItemPrice,
    miniCartProductImage
} from '../../fields/miniCart';

export const assertGuestCheckoutPage = () => {
    cy.get(guestElementSelector).should('exist');
};

export const assertProductInList = name => {
    cy.get(miniCartProductList).should('contain', name);
};

export const assertCartEmptyMessage = () => {
    cy.get(miniCartEmptyMessage).should('exist');
};

/**
 * Utility function to assert MiniCart text is in correct language (french or english)
 * @param {String} language -- language to validate (ISO639 codes only, eg. "fra,eng")
 */
export const assertMiniCartTextLanguage = language => {
    const textToValidate = [];
    cy.get(miniCartTotalQuantity).then($quantity =>
        textToValidate.push($quantity.text().replace(/\d/, ''))
    );
    cy.get(miniCartSubtotalPriceLabel).then($label =>
        textToValidate.push($label.text().replace(':', ''))
    );
    cy.get(miniCartCheckoutButton).then($button =>
        textToValidate.push($button.text().toLowerCase())
    );
    cy.get(miniCartEditCartButton).then($button => {
        textToValidate.push($button.text());
        expect(validateLanguage(textToValidate.join(','), language)).to.be.true;
    });
};

/**
 * Utility function to assert products in MiniCart displays correct currency.
 *
 * @param {String} currency -- currency code to validate
 */
export const assertMiniCartProductHasCurrency = currency => {
    const currencySymbolMap = {
        USD: '$',
        EUR: '€'
    };
    cy.get(miniCartSubtotalPrice).should(
        'contain',
        currencySymbolMap[currency]
    );
    cy.get(miniCartItemPrice).should('contain', currencySymbolMap[currency]);
};

/**
 * Utility function to assert product in MiniCart displays correct image.
 *
 * @param {String} src -- fragment of image src
 * @param {Number} index -- index of product in MiniCart
 */
export const assertProductImageDisplayed = (src, index) => {
    cy.get(miniCartProductImage)
        .filter(':odd')
        .eq(index)
        .should('have.attr', 'src')
        .should('contain', src);
};
