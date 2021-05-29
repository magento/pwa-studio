import {
    productPageAddToWishListButton,
    productPageSelectedWishlistButton
} from '../../fields/productPage';

/**
 * Utility function to add product to wishlist from product page
 */
export const addProductToWishlistFromProductPage = () => {
    // add product to wishlist
    cy.get(productPageAddToWishListButton).click();

    // assert product selected indicator
    cy.get(productPageSelectedWishlistButton).should('exist');
};
