import {
    guestElementSelector,
    miniCartProductList,
    miniCartEmptyMessage
} from '../../fields/miniCart';

export const assertGuestCheckoutPage = () => {
    cy.get(guestElementSelector).should('exist');
};

export const assertAnchorLink = link => {
    cy.url().should('include', link);
};

export const assertProductInList = name => {
    cy.get(miniCartProductList).should('contain', name);
};

export const assertCartEmptyMessage = () => {
    cy.get(miniCartEmptyMessage).should('exist');
};
