
import { miniCartTriggerButton, miniCartCheckoutButton, miniCartProductImageLink, miniCartProductLink } from '../../fields/miniCart';

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
}

/**
 * Utility function to click on Product Image Link from miniCart
 */
export const clickProductImageLinkFromMiniCart = () => {
    cy.get(miniCartProductImageLink).click();
}
