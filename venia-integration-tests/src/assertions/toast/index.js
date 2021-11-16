import { toastRoot, toastMessage } from '../../fields/toast';

export const assertToastExists = () => {
    cy.get(toastRoot).should('exist');
};

export const assertToastMessage = message => {
    cy.get(toastMessage).should('contain.text', message);
};
