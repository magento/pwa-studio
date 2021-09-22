import {
    accountInformationPageHeading,
    accountInformationEditButton,
    accountInformationEditModalTitle
} from '../../fields/accountInformationPage';

/**
 * Utility function to assert Account Information Page
 *
 * @param {String} headerText header text
 */
export const assertAccountInformationHeading = headerText => {
    cy.get(accountInformationPageHeading).should('contain', headerText);
};

/**
 * Utility function to assert Account Information Edit Button exists
 */
export const assertAccountInformationEditButton = () => {
    cy.get(accountInformationEditButton).should('exist');
};

/**
 * Utility function to assert Account Information Edit Modal
 *
 * @param {String} modalTitle modal text
 */
export const assertAccountInformationEditHeading = modalTitle => {
    cy.get(accountInformationEditModalTitle).should('contain', modalTitle);
};
