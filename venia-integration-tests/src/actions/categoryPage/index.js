import {
    categoryPageAddToWishListButton,
    categoryPageSelectedWishlistButton
} from '../../fields/categoryPage';

/**
 * Utility function to add product to wishlist from category page
 */
export const addProductToWishlistFromCategoryPage = () => {
    // add product to wishlist
    cy.xpath(categoryPageAddToWishListButton).contains('Carina Cardigan').click();

    // assert product selected indicator
    cy.xpath(categoryPageSelectedWishlistButton).contains('Carina Cardigan').should('exist');
};
