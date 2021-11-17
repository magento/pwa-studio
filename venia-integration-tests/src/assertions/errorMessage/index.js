import {
    errorMessageRoot,
    errorMessageMessage
} from '../../fields/errorMessage';

export const assertErrorMessageExists = () => {
    cy.get(errorMessageRoot).should('exist');
};

export const assertErrorMessageContains = message => {
    cy.get(errorMessageMessage).should('contain.text', message);
};
