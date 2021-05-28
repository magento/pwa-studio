import {
    myAccountMenuItemsField,
    myAccountMenuItemsList
} from '../../fields/myAccountMenu';

/**
 * Utility function to navigate to my account pages
 *
 * @param {String} firstName auth user name
 * @param {String} myAccountPage respective my account page to navigate
 */
export const goToMyAccount = (firstName, myAccountPage) => {
    // exapnd my account menu
    cy.get(myAccountMenuItemsField)
        .contains(firstName)
        .click();

    // click on my account page
    cy.get(myAccountMenuItemsList)
        .contains(myAccountPage)
        .click();
};
