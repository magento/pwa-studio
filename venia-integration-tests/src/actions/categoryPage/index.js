import {
    categoryPageAddToWishListButton,
    categoryPageSelectedWishlistButton
} from '../../fields/categoryPage';

/**
 * Utility function to add product to wishlist from category page
 */
export const addProductToWishlistFromCategoryPage = () => {
    // 
    cy.xpath(categoryPageAddToWishListButton).click();
};

