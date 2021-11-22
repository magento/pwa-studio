import { errorViewRoot, errorViewMessage } from '../../fields/notFoundPage';

/**
 * Utility function to assert Error area is present
 */
export const assertErrorInPage = () => {
    cy.get(errorViewRoot).should('exist');
};

/**
 * Utility function to assert not found message is present
 *
 * @param {String} message Not found message
 */
export const assertNotFoundMessage = message => {
    cy.get(errorViewMessage).should('contain.text', message);
};
