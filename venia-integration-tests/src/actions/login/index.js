import {
    usernameField,
    passwordField,
    loginTriggerField
} from '../../fields/login';

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
    cy.visit('/');

    cy.wait(500);

    // open the signin dialog
    cy.get(loginTriggerField).click();
};
