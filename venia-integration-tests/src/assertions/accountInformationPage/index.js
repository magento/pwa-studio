import {
    accountInformationPageHeading,
    accountInformationEditButton,
    accountInformationEditModalTitle
} from '../../fields/accountInformationPage';

/**
 * Utility function to assert Account Information Page
 * @param {String} headerText header text
 */
export const assertAccountInformationHeading = headerText => {
    // assert header text
    cy.get(accountInformationPageHeading).contains(headerText);
};

/**
 * Utility function to assert Account Information Edit Button exists
 */
export const assertAccountInformationEditButton = () => {
    // assert button exists
    cy.get(accountInformationEditButton).should('exist');
};

/**
 * Utility function to assert Account Information Edit Modal
 * @param {String} modalText modal text
 */
export const assertAccountInformationEditHeading = modalText => {
    // assert modal text
    cy.get(accountInformationEditModalTitle).contains(modalText);
};
