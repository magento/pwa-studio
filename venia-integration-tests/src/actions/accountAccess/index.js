import {
    firstNameTextField,
    lastNameTextField,
    createAccountEmailTextField,
    createAccountPasswordTextField,
    createAccountSubmitButton,
} from '../../fields/accountAccess';

/**
 * Utility function to assert create account in Venia 
 *
 * @param {String} firstName firstName to createAccount
 * @param {String} lastName lastName to createAccount
 * @param {String} accountEmail accountEmail to createAccount
 * @param {String} accountPassword accountPassword to createAccount
 */
export const assertCreateAccount = (firstName, lastName, accountEmail, accountPassword) => {
    // Enter username into the username field
    cy.get(firstNameTextField).type(firstName);

    // Enter password into the password field
    cy.get(lastNameTextField).type(lastName);

    // Enter username into the username field
    cy.get(createAccountEmailTextField).type(accountEmail);

    // Enter password into the password field
    cy.get(createAccountPasswordTextField).type(accountPassword);

    // Enter password into the password field
    cy.get(createAccountSubmitButton).click;
};
