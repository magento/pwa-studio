import { validateLanguage } from '../../utils/language-test-utils';
import {
    myAccountMenuItemsField,
    myAccountMenuItemLinks
} from '../../fields/myAccountMenu';
import { signOutLink } from '../../fields/accountAccess';
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

/**
 * Utility function to assert AccountMenu text is in correct language (french or english)
 * @param {String} language -- language to validate (ISO639 codes only, eg. "fra,eng")
 */
export const assertAccountMenuTextLanguage = language => {
    const textToValidate = [];
    cy.get(myAccountMenuItemsField).click();
    cy.get(myAccountMenuItemLinks).then($links =>
        textToValidate.push($links.text())
    );
    cy.get(signOutLink).then($link => {
        textToValidate.push($link.text());
        expect(validateLanguage(textToValidate.join(','), language)).to.be.true;
    });
};
