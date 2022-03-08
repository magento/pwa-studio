import {
    searchPageAddToCartButton,
    searchPageProduct
} from '../../fields/searchPage';

/**
 * Utility function to add a product to cart from SearchPage.
 *
 * @param {String} product name of the product to add to cart
 */

export const addProductToCartFromSearchPage = product => {
    cy.get(searchPageProduct)
        .contains(product)
        .siblings()
        .find(searchPageAddToCartButton)
        .click();
};
