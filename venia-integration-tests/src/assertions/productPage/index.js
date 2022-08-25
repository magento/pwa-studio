import { validateLanguage } from '../../utils/language-test-utils';
import {
    productPageSelectedWishlistButton,
    productPageName,
    productPageAddToCartButton,
    productPageAddToWishListButton,
    productPageQuantityTitle,
    productPageDescriptionTitle,
    productPageOptionLabels,
    productPagePrice,
    productPageSizeButton
} from '../../fields/productPage';

/**
 * Utility function to assert the product is in wishlist
 */
export const assertProductSelectIndicator = () => {
    // assert product selected indicator
    cy.get(productPageSelectedWishlistButton).should('exist');
};

/**
 * Utility function to assert the product name
 */
export const assertProductName = name => {
    cy.get(productPageName).should('contain', name);
};

/**
 * Utility function to assert ProductPage text is in correct language (french or english)
 * @param {String} language -- language to validate (ISO639 codes only, eg. "fra,eng")
 */
export const assertProductPageTextLanguage = language => {
    const textToValidate = [];
    cy.get(productPageOptionLabels).then($labels =>
        textToValidate.push($labels.text())
    );
    cy.get(productPageQuantityTitle).then($title =>
        textToValidate.push($title.text())
    );
    cy.get(productPageDescriptionTitle).then($title =>
        textToValidate.push($title.text())
    );
    cy.get(productPageAddToCartButton).then($button =>
        textToValidate.push($button.text())
    );
    cy.get(productPageAddToWishListButton).then($button => {
        textToValidate.push($button.text());
        expect(validateLanguage(textToValidate.join(','), language)).to.be.true;
    });
};

/**
 * Utility function to assert product in ProductPage displays correct currency.
 *
 * @param {String} currency -- currency code to validate
 */
export const assertProductPriceHasCurrency = currency => {
    const currencySymbolMap = {
        USD: '$',
        EUR: '€'
    };

    cy.get(productPagePrice).should('contain', currencySymbolMap[currency]);
};

/**
 * Utility function to assert product in ProductPage displays out of stock.
 */
export const assertProductIsOutOfStock = () => {
    cy.get(productPageAddToCartButton).contains('Out of Stock');
};

/**
 * Utility function to assert if a swatch is disabled
 */
export const assertSizeSwatchDisable = option => {
    cy.get(productPageSizeButton)
        .get(`[title="${option}"]`)
        .should('be.disabled');
};
