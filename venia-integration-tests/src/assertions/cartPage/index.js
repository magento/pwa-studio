import { productListingProductName } from '../../fields/cartPage';

/**
 * Utility function to assert Product is in Cart Page
 *
 * @param {String} name Product's name
 */
export const assertProductInCartPage = name => {
    cy.get(productListingProductName).should('contain', name);
};
