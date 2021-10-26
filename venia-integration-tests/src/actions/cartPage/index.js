import {
    cartPageRoot,
    kebabMenuButton,
    saveForLaterButton,
    cartPageProductImageLink,
    cartPageProductLink
} from '../../fields/cartPage';

/**
 * Utility to move a product from the cart page to a single wishlist
 */
export const moveProductFromCartToSingleWishlist = productName => {
    const itemToMove = cy.get(cartPageRoot).contains('li', productName);

    itemToMove.get(kebabMenuButton).click();

    itemToMove.get(saveForLaterButton).click();
};

/**
 * Utility to click on product image link from cart page
 */
export const clickProductImageLinkFromCart = () => {
    cy.get(cartPageProductImageLink).click();
};

/**
 * Utility to click on product link from cart page
 */
export const clickProductLinkFromCart = () => {
    cy.get(cartPageProductLink).click();
};
