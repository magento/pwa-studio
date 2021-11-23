import {
    miniCartTriggerButton,
    miniCartCheckoutButton,
    miniCartProductImageLink,
    miniCartProductLink,
    miniCartEditCartButton,
    miniCartProduct,
    miniCartProductDelete
} from '../../fields/miniCart';

/**
 * Utility to trigger miniCart
 */
export const triggerMiniCart = () => {
    cy.get(miniCartTriggerButton).click();
};

/**
 * Utility function to click on Checkout from miniCart
 */
export const moveToCheckoutFromMiniCart = () => {
    cy.get(miniCartCheckoutButton).click();
};

/**
 * Utility function to click on Product Link from miniCart
 */
export const clickProductLinkFromMiniCart = () => {
    cy.get(miniCartProductLink).click();
};

/**
 * Utility function to click on Product Image Link from miniCart
 */
export const clickProductImageLinkFromMiniCart = () => {
    cy.get(miniCartProductImageLink).click();
};

export const goToCartPageFromEditCartButton = () => {
    cy.get(miniCartEditCartButton).click();
};

export const removeProductFromMiniCart = (itemIndex = 0) => {
    const item = cy.get(miniCartProduct).eq(itemIndex);

    item.find(miniCartProductDelete).click();
};
