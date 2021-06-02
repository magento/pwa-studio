import { myAccountMenuItemsField } from '../../fields/myAccountMenu';

/**
 * Utility function to assert repective auth user exists
 *
 * @param {String} firstName auth user name
 */
export const assertCreateAccount = firstName => {
    // assert auth user exists
    cy.get(myAccountMenuItemsField).contains('Hi, ' + firstName);
};
