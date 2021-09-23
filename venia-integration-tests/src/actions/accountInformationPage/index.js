import {
    accountInformationEditButton,
    accountInformationEditModalChangePasswordLink,
    accountInformationEditModalCurrentPasswordTextField,
    accountInformationEditModalEmailTextField,
    accountInformationEditModalFirstNameTextField,
    accountInformationEditModalLastNameTextField,
    accountInformationEditModalNewPasswordTextField,
    accountInformationEditModalSubmitButton
} from '../../fields/accountInformationPage';

/**
 * Utility function to open Account Information Edit Modal
 */
export const openAccountInformationEditModal = () => {
    cy.get(accountInformationEditButton).click();
};

/**
 * Utility function to update Account Information
 *
 * @param {String} updatedFirstName updated first name
 * @param {String} updatedLastName updated last name
 * @param {String} updatedAccountEmail updated account email
 * @param {String} currentAccountPassword current account password
 */
export const editAccountInformation = (
    updatedFirstName,
    updatedLastName,
    updatedAccountEmail,
    currentAccountPassword
) => {
    cy.get(accountInformationEditModalFirstNameTextField)
        .clear()
        .type(updatedFirstName);

    cy.get(accountInformationEditModalLastNameTextField)
        .clear()
        .type(updatedLastName);

    cy.get(accountInformationEditModalEmailTextField)
        .clear()
        .type(updatedAccountEmail);

    cy.get(accountInformationEditModalCurrentPasswordTextField).type(
        currentAccountPassword
    );

    cy.get(accountInformationEditModalSubmitButton).click();
};

/**
 * Utility function to update Account Information Password
 *
 * @param {String} currentAccountPassword current account password
 * @param {String} updatedAccountPassword updated account password
 */
export const editAccountInformationPassword = (
    currentAccountPassword,
    updatedAccountPassword
) => {
    cy.get(accountInformationEditModalChangePasswordLink).click();

    cy.get(accountInformationEditModalCurrentPasswordTextField).type(
        currentAccountPassword
    );

    cy.get(accountInformationEditModalNewPasswordTextField).type(
        updatedAccountPassword
    );

    cy.get(accountInformationEditModalSubmitButton).click();
};
