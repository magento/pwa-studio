import { myAccountMenuItemsField } from '../../fields/myAccountMenu';
import { signOut } from '../../fixtures/accountAccess';

/**
 * Utility function to assert respective auth user exists
 *
 * @param {String} firstName auth user name
 */
export const assertCreateAccount = firstName => {
    // assert auth user exists
    cy.get(myAccountMenuItemsField).should('contain', `Hi, ${firstName}`);
};

/**
 * Utility function to assert user is signed out
 */
export const assertSignedOut = () => {
    cy.get(myAccountMenuItemsField).should('contain', signOut);
};
