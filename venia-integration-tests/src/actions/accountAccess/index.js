import {
    accountTriggerButton,
    createAccountInitiateButton,
    firstNameTextField,
    lastNameTextField,
    createAccountEmailTextField,
    createAccountPasswordTextField,
    createAccountSubmitButton,
} from '../../fields/accountAccess';

/**
 * Utility function to open the login dialog
 */
export const openLoginDialog = () => {
    // open the signin dialog
    cy.get(accountTriggerButton).click();
};

/**
 * Utility function to create account in Venia using the
 * username and password provided.
 *
 * @param {String} firstName firstName to createAccount
 * @param {String} lastName lastName to createAccount
 * @param {String} accountEmail accountEmail to createAccount
 * @param {String} accountPassword accountPassword to createAccount
 */
export const createAccount = (firstName, lastName, accountEmail, accountPassword) => {
    // click on create account button
    cy.get(createAccountInitiateButton).contains('Create an Account').click()

    // enter user name
    cy.get(firstNameTextField).type(firstName);

    // Enter password into the password field
    cy.get(lastNameTextField).type(lastName);

    // Enter username into the username field
    cy.get(createAccountEmailTextField).type(accountEmail);

    // Enter password into the password field
    cy.get(createAccountPasswordTextField).type(accountPassword);

    // Enter password into the password field
    cy.get(createAccountSubmitButton).contains('Create an Account').click()
};

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
