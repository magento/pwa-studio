import {
    productPageAddToCartButton,
    productPageAddToWishListButton,
    productPageOptions,
    productPageQuantityField,
    addProductToWishlist
} from '../../fields/productPage';

/**
 * Utility function to add product to wishlist from the Product Page
 */
export const addProductToWishlistFromProductPage = () => {
    // add product to wishlist
    cy.get(productPageAddToWishListButton).click();
};

/**
 * Utility function to add product to wishlist from product page Dialog window
 *
 * @param {String} wishlistName wishlist name where to add product
 */
export const addProductToExistingWishlistFromDialog = wishlistName => {
    cy.get(addProductToWishlist)
        .contains(wishlistName)
        .click();
};

/**
 * Utility function to add product to cart from the Product Page
 */
export const addToCartFromProductPage = () => {
    cy.get(productPageAddToCartButton)
        .should('be.enabled')
        .click();
};

/**
 * Utility function to select Product Options from the Product Page
 */
export const selectOptionsFromProductPage = () => {
    cy.get(productPageOptions)
        .should('exist')
        .each($options => {
            // Select first option
            cy.wrap($options)
                .find('button')
                .eq(0)
                .click();
        });
};

/**
 * Utility function to set Product Quantity from the Product Page
 *
 * @param {Number} qty set Product quantity
 */
export const setQuantityFromProductPage = (qty = 1) => {
    cy.get(productPageQuantityField)
        .clear()
        .type(qty.toString());
};
