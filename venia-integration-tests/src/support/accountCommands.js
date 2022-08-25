import {
    accountTriggerButton,
    createAccountInitiateButton,
    firstNameTextField,
    lastNameTextField,
    createAccountEmailTextField,
    createAccountPasswordTextField,
    createAccountSubmitButton,
    signInEmailTextField,
    signInPasswordTextField,
    signInSubmitButton,
    signOutLink,
    forgotPasswordLink,
    forgotPasswordEmailTextField,
    forgotPasswordSubmitButton
} from '../fields/accountAccess';

const toggleLoginDialog = () => {
    // Open the sign in dialog
    cy.get(accountTriggerButton).click();
};

const createAccount = (firstName, lastName, accountEmail, accountPassword) => {
    // Click on create account button
    cy.get(createAccountInitiateButton).click();

    // Enter user name
    cy.get(firstNameTextField).type(firstName);

    // Enter password into the password field
    cy.get(lastNameTextField).type(lastName);

    // Enter username into the username field
    cy.get(createAccountEmailTextField).type(accountEmail);

    // Enter password into the password field
    cy.get(createAccountPasswordTextField).type(accountPassword);

    // Submit form
    cy.get(createAccountSubmitButton).click();
};

const resetPassword = accountEmail => {
    // Click on Forgot Password link
    cy.get(forgotPasswordLink)
        .contains('Forgot Password?')
        .click();

    // Enter email
    cy.get(forgotPasswordEmailTextField).type(accountEmail);

    // Submit form
    cy.get(forgotPasswordSubmitButton)
        .contains('Submit')
        .click();
};

const signInAccount = (accountEmail, accountPassword) => {
    // Enter username into the username field
    cy.get(signInEmailTextField).type(accountEmail);

    // Enter password into the password field
    cy.get(signInPasswordTextField).type(accountPassword);

    // Submit form
    cy.get(signInSubmitButton).click();
};

const signOutAccount = () => {
    cy.get(signOutLink)
        .contains('Sign Out')
        .click();
};

Cypress.Commands.add('toggleLoginDialog', toggleLoginDialog);
Cypress.Commands.add('createAccount', createAccount);
Cypress.Commands.add('resetPassword', resetPassword);
Cypress.Commands.add('signInAccount', signInAccount);
Cypress.Commands.add('signOutAccount', signOutAccount);
