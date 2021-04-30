import {
    categoryPageAddToWishListButton,
    categoryPageSelectedWishlistButton
} from '../../fields/categoryPage';

/**
 * Utility function to add product to wishlist from category page
 */
export const addProductToWishlistFromCategoryPage = (productToAdd) => {
    // add product to wishlist
    cy.contains(productToAdd).siblings().find(categoryPageAddToWishListButton).click();

    // assert product selected indicator
    cy.contains(productToAdd).siblings().find(categoryPageSelectedWishlistButton).should('exist');
};
