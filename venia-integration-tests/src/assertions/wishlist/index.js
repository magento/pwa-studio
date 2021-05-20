import {
    wishlistPageHeading,
    wishlistRoot,
    wishlistItemPrice,
    wishlistItemAddToCartSection,
    wishlistItemAddToCartButton,
    wishlistItemMoreActionsButton
} from '../../fields/wishlist';

/**
 * Utility function to assert empty wishlist
 * @param {String} wishlistHeaderText wishlist page header text
 */
export const assertWishlistHeading = wishlistHeaderText => {
    // assert wishlist header text
    cy.get(wishlistPageHeading).contains(wishlistHeaderText);
};

/**
 * Utility function to assert empty wishlist
 */
export const assertEmptyWishlist = () => {
    // assert product container does not exists
    cy.get(wishlistRoot).should('not.exist');
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

    // assert Add To Cart Section  exists
    cy.contains('div', productName)
        .children(wishlistItemAddToCartSection)
        .should('exist');

    // assert Add to Cart button exists
    cy.contains('div', productName)
        .children()
        .find(wishlistItemAddToCartButton)
        .should('exist');

    // assert more actions button exists
    cy.contains('div', productName)
        .children()
        .find(wishlistItemMoreActionsButton)
        .should('exist');
};
