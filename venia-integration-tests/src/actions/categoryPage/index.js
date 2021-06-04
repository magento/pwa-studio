import {
    categoryPageAddToWishListButton
} from '../../fields/categoryPage';

/**
 * Utility function to add product to wishlist from category page
 */
export const addProductToWishlistFromCategoryPage = productToAdd => {
    // add product to wishlist
    cy.contains(productToAdd)
        .siblings()
        .find(categoryPageAddToWishListButton)
        .click();
};
