import {
    categoryPageAddToWishListButton,
    createWishlistButton,
    wishlistNameField,
    createWishlistConfirmButton
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

/**
 * Utility function to create wishlist
 *
 * @param {String} wishlistName wishlist name
 */
export const createWishlistViaDialog = wishlistName => {
    // click on Create a List link
    cy.get(createWishlistButton).click();

    // enter wishlist name
    cy.get(wishlistNameField).type(wishlistName);

    // Create wishlist
    cy.get(createWishlistConfirmButton).click();
};
