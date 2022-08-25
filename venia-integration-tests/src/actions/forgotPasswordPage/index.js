import {
    forgotPasswordFormEmail,
    forgotPasswordFormSubmitButton
} from '../../fields/forgotPasswordPage';

/**
 * Utility function to request password
 *
 * @param {String} email requested email
 */
export const requestForgotPassword = ({ email }) => {
    cy.get(forgotPasswordFormEmail)
        .clear()
        .type(email);

    cy.get(forgotPasswordFormSubmitButton)
        .should('not.be.disabled')
        .click();
};
