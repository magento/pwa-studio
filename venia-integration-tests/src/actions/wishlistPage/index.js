import {
    createWishlistButton,
    wishlistNameField,
    createWishlistConfirmButton
} from '../../fields/wishlist';

/**
 * Utility function to create wishlist
 *
 * @param {String} wishlistName wishlist name
 */
export const createWishlist = wishlistName => {
    // click on Create a List link
    cy.get(createWishlistButton).click();

    // enter wishlist name
    cy.get(wishlistNameField).type(wishlistName);

    // Create wishlist
    cy.get(createWishlistConfirmButton).click();
};
