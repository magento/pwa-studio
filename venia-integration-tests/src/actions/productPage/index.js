import {
    productPageAddToWishListButton,
    addProductToWishlist
} from '../../fields/productPage';

/**
 * Utility function to add product to wishlist  from product page
 */
export const addProductToWishlistFromProductPage = () => {
    // add product to wishlist
    cy.get(productPageAddToWishListButton).click();
};

/**
 * Utility function to add product to wishlist from product page Dialog window
 */
export const addProductToExistingWishlistFromDialog = wishlistName => {
    // add product to wishlist
    cy.get(addProductToWishlist)
        .contains(wishlistName)
        .click();
};
