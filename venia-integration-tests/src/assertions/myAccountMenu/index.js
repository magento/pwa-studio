import { myAccountMenuItemsField } from '../../fields/myAccountMenu';

/**
 * Utility function to assert respective auth user exists
 *
 * @param {String} firstName auth user name
 */
export const assertCreateAccount = firstName => {
    // assert auth user exists
    cy.get(myAccountMenuItemsField).contains('Hi, ' + firstName);
};

/**
 * Utility function to assert user is signed out
 */
export const assertSignedOut = () => {
    cy.get(myAccountMenuItemsField).contains('Sign In');
};
