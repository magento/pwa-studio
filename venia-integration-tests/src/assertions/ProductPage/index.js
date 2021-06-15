import { productPageSelectedWishlistButton } from '../../fields/productPage';

/**
 * Utility function to assert the product is in wishlist
 */
export const assertProductSelectIndicator = () => {
    // assert product selected indicator
    cy.get(productPageSelectedWishlistButton).should('exist');
};
