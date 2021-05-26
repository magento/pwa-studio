import {
    wishlistPageHeading,
    wishlistRoot,
    wishlistItemPrice,
    wishlistItemAddToCartSection,
    wishlistItemAddToCartButton,
    wishlistItemMoreActionsButton,
    removeProduct,
    deleteProduct
} from '../../fields/wishlist';
import { wishlistRemove, removeProductMessage } from '../../fixtures/wishlist';

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

/**
 * Utility function to remove given product from wishlist
 * @param {String} productName product to be removed
 */
export const removeProductFromWishlist = productName => {
    // click on More actions button
    cy.contains('div', productName)
        .children()
        .find(wishlistItemMoreActionsButton)
        .click();

    // click on Remove button
    cy.get(removeProduct)
        .contains(wishlistRemove)
        .click();

    // verfiy message is displayed
    cy.contains(removeProductMessage).should('exist');

    // click on Delete button
    cy.get(deleteProduct).click();
};
