import {
    miniCartTriggerButton,
    miniCartEditCartButton
} from '../../fields/miniCart';

export const triggerMiniCart = () => {
    cy.get(miniCartTriggerButton).click();
};

export const goToCartPageFromEditCartButton = () => {
    cy.get(miniCartEditCartButton).click();
};
