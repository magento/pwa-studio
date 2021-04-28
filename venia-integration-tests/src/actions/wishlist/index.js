import {
    wishlistPageHeading,
    wishlistRoot
} from '../../fields/wishlist';

/**
 * Utility function to assert empty wishlist
 * @param {String} wishlistHeaderText respective my account page to navigate
 */
export const assertEmptyWishlist = (wishlistHeaderText) => {
    // open the signin dialog
    cy.get(wishlistPageHeading).contains(wishlistHeaderText);
    cy.get(wishlistRoot).should('not.exist');
};
