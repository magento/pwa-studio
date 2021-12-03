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
    cy.get(myAccountMenuItemsField).should('contain', firstName);

    // Toggle my account menu if not visible
    cy.get('body').then($body => {
        if ($body.find(myAccountMenuItemsList).length === 0) {
            cy.toggleLoginDialog();
        }
    });

    // Click on my account page
    cy.get(myAccountMenuItemsList)
        .contains(myAccountPage)
        .click();
};
