import {
    accountTriggerButton,
    createAccountInitiateButton,
    firstNameTextField,
    lastNameTextField,
    createAccountEmailTextField,
    createAccountPasswordTextField,
    createAccountSubmitButton
} from '../fields/accountAccess';

const openLoginDialog = () => {
    // open the signin dialog
    cy.get(accountTriggerButton).click();
};

const createAccount = (firstName, lastName, accountEmail, accountPassword) => {
    // click on create account button
    cy.get(createAccountInitiateButton)
        .contains('Create an Account')
        .click();

    // enter user name
    cy.get(firstNameTextField).type(firstName);

    // Enter password into the password field
    cy.get(lastNameTextField).type(lastName);

    // Enter username into the username field
    cy.get(createAccountEmailTextField).type(accountEmail);

    // Enter password into the password field
    cy.get(createAccountPasswordTextField).type(accountPassword);

    // Enter password into the password field
    cy.get(createAccountSubmitButton)
        .contains('Create an Account')
        .click();
};

Cypress.Commands.add('openLoginDialog', openLoginDialog);
Cypress.Commands.add('createAccount', createAccount);
