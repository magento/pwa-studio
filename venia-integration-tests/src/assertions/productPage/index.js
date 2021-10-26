import {
    productPageSelectedWishlistButton,
    productPageName
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
