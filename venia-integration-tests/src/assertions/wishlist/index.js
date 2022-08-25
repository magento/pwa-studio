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
    cy.get(wishlistRoot)
        .contains(productName)
        .should('exist');

    // assert Product Price exists
    cy.get(wishlistRoot)
        .contains('div', productName)
        .siblings(wishlistItemPrice)
        .should('exist');

    // assert Add to Cart button exists
    cy.get(wishlistRoot)
        .contains('div', productName)
        .siblings(wishlistItemAddToCartButton)
        .should('exist');
};

/**
 * Utility function to assert product does not exist in the wishlist
 * @param {String} productName product to verify it does not exist in wishlist
 */
export const asserProductNotInWishlist = productName => {
    // assert Product container exists
    cy.get(wishlistRoot).should('exist');

    // assert Product does not exist
    cy.get(wishlistRoot)
        .contains(productName)
        .should('not.exist');
};

/**
 * Utility function to assert create wishlist link exists
 */
export const assertCreateWishlistLink = () => {
    // assert create a list link exists
    cy.get(createWishlistButton).should('exist');
};

/**
 * Utility function to assert create wishlist link does not exist
 */
export const assertCreateWishlistLinkNotVisible = () => {
    // assert create a list link does not exist
    cy.get(createWishlistButton).should('not.exist');
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
