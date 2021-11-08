import { guestElementSelector } from '../../fields/miniCart';

export const assertGuestCheckoutPage = () => {
    cy.get(guestElementSelector).should('exist');
};

export const assertAnchorLink = link => {
    cy.url().should('include', link);
};
