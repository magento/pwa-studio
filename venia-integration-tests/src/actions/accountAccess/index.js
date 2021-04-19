import {
    accountTriggerButton,
    signInEmailTextField,
    signInPasswordTextField,
    forgotPasswordLink,
    signInButton,
    createAccountInitiateButton,
    firstNameTextField,
    lastNameTextField,
    createAccountEmailTextField,
    createAccountPasswordTextField,
    subscribeToNewsCheckBox,
    createAccountSubmitButton,
    createAccountCancelButton
} from '../../fields/accountAccess';

/**
 * Utility function to login to Venia using the
 * username and password provided.
 *
 * @param {String} username username to login
 * @param {String} password password to login
 */
export const login = (username, password) => {
    // Enter username into the username field
    cy.get(usernameField).type(username);

    // Enter password into the password field
    cy.get(passwordField).type(password);
};

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
    // Enter password into the password field
    cy.get(createAccountInitiateButton).click;

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
