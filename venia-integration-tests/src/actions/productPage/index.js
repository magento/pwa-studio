import {
    productPageRoot,
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

/**
 * Utility function to add simple product to cart from the product page
 *
 * Note: This only works for simple product because it doesnt consider
 * product options. A different function has to be used for different
 * types of products like configurable or virtual.
 */
export const addSimpleProductToCartFromProductPage = () => {
    // get the add to cart button and click it

    cy.get(productPageRoot)
        .contains('button', 'Add to Cart')
        .click();
};
