import { appMaskButton, headerNavTrigger } from '../../fields/header';

export const toggleHeaderNav = () => {
    cy.get(headerNavTrigger).click();
};

export const closeAppMask = () => {
    cy.get(appMaskButton).click({ force: true });
};
