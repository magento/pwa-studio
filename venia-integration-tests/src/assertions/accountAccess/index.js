import { forgotPasswordSuccess } from '../../fields/accountAccess';

/**
 * Utility function to assert success of the Reset Password Form
 *
 * @param {String} accountEmail account email
 */
export const assertResetPasswordSuccess = accountEmail => {
    cy.get(forgotPasswordSuccess).should(
        'contain',
        `If there is an account associated with ${accountEmail} you will receive an email with a link to change your password.`
    );
};
