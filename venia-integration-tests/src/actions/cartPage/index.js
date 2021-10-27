import {
    cartPageRoot,
    kebabMenuButton,
    saveForLaterButton,
    kebabMenuEditButton,
    editMenuColorButton,
    editMenuSizeButton,
    editMenuIncreaseQtyStepper,
    editMenuUpdateCartButton,
    cartPageCheckoutButton,
    productKebab,
    productListingProduct,
    productSectionRemoveFromCartButton
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
 * Utility to open a product's edit dialog from the cart page
 */
export const openProductKebabMenu = productName => {
    const itemToEdit = cy.get(cartPageRoot).contains('li', productName);

    itemToEdit.get(kebabMenuButton).click();
};

export const openProductEditMenu = productName => {
    const itemToEdit = cy.get(cartPageRoot).contains('li', productName);

    itemToEdit.get(kebabMenuEditButton).click();
};

/**
 * Utility to select a product's color in edit dialog
 */
export const editProductColor = color => {
    cy.get(`${editMenuColorButton}[title*="${color}"]`).click();
};
/**
 * Utility to select a product's size in edit dialog
 */
export const editProductSize = size => {
    cy.get(editMenuSizeButton)
        .contains('span', size)
        .click();
};
/**
 * Utility to increase a product's quantity in edit dialog
 */
export const increaseProductQuantity = () => {
    cy.get(editMenuIncreaseQtyStepper).click();
};
/**
 * Utility to submit product modifications on edit dialog
 */
export const clickOnUpdateCart = () => {
    cy.get(editMenuUpdateCartButton).click();
};
/**
 * Utility to go to checkout page from cart page
 */
export const goToCheckout = () => {
    cy.get(cartPageCheckoutButton).click();
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
