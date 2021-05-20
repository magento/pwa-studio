import {
    wishlistItemMoreActionsButton,
    removeProduct,
    deleteProduct
} from '../../fields/wishlist';
import { wishlistRemove, removeProductMessage } from '../../fixtures/wishlist';

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
