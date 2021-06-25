import {
    wishlistPageHeading,
    wishlistRoot,
    wishlistItemPrice,
    wishlistItemAddToCartButton,
    createWishlistButton
} from '../../fields/wishlist';

import { emptyWishlistMessage } from '../../fixtures/wishlist';

/**
 * Utility function to assert empty wishlist
 * @param {String} wishlistHeaderText wishlist page header text
 */
export const assertWishlistHeading = wishlistHeaderText => {
    // assert wishlist header text
    cy.get(wishlistPageHeading).contains(wishlistHeaderText);
};

/**
 * Utility function to assert product exists in wishlist
 * @param {String} productName product to verify it exist in wishlist
 */
export const assertProductInWishlist = productName => {
    // assert Product container exists
    cy.get(wishlistRoot).should('exist');

    // assert Product exists
    cy.contains(productName).should('exist');

    // assert Product Price exists
    cy.contains('div', productName)
        .children(wishlistItemPrice)
        .should('exist');

    // assert Add to Cart button exists
    cy.contains('div', productName)
        .children(wishlistItemAddToCartButton)
        .should('exist');
};

/**
 * Utility function to assert create wishlist link exists
 */
export const assertCreateWishlistLink = () => {
    // assert create a list link exists
    cy.get(createWishlistButton).should('exist');
};

/**
 * Utility function to assert empty wishlist for multiple wishlists
 */
export const assertEmptyWishlistExists = wishlistName => {
    // assert wishlist exists and is empty
    cy.get(wishlistRoot)
        .should('contain.text', wishlistName)
        .should('contain.text', emptyWishlistMessage);
};
