import {
    cartPageRoot,
    kebabMenuButton,
    saveForLaterButton
} from '../../fields/cartPage';

/**
 * Utility to move a product from the cart page to a single wishlist
 */
export const moveProductFromCartToSingleWishlist = productName => {
    const itemToMove = cy.get(cartPageRoot).contains('li', productName);

    itemToMove.get(kebabMenuButton).click();

    itemToMove.get(saveForLaterButton).click();
};
