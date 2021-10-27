import {
    cartPageRoot,
    kebabMenuButton,
    productKebab,
    productListingProduct,
    productSectionRemoveFromCartButton,
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

/**
 * Utility to remove product from Cart
 *
 * @param {String} productName product name
 */
export const removeProductFromCart = productName => {
    cy.get(productListingProduct)
        .contains(productListingProduct, productName)
        .find(productKebab)
        .click()
        .closest(productListingProduct)
        .find(productSectionRemoveFromCartButton)
        .click();
};
