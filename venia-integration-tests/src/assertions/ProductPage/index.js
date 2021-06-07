import { productPageSelectedWishlistButton } from '../../fields/productPage';

/**
 * Utility function to add product to wishlist from product page
 */
export const assertProductSelectIndicator = () => {
    // assert product selected indicator
    cy.get(productPageSelectedWishlistButton).should('exist');
};
