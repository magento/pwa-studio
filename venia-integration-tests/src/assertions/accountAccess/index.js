import {
    forgotPasswordSuccess,
    signInTitleText,
    signInFormLabels,
    signInSubmitButton,
    forgotPasswordLink,
    createAccountInitiateButton,
    createAccountFormLabels,
    createAccountSubmitButton,
    createAccountTitle,
    createAccountCancelButton,
    forgotPasswordTitleText,
    forgotPasswordInstructionsText,
    forgotPasswordForm
} from '../../fields/accountAccess';

import { validateLanguage } from '../../utils/language-test-utils';

/**
 * Utility function to assert success of the Reset Password Form
 *
 * @param {String} accountEmail account email
 */
export const assertResetPasswordSuccess = accountEmail => {
    cy.get(forgotPasswordSuccess).should(
        'contain',
        `If there is an account associated with ${accountEmail} you will receive an email with a link to change your password.`
    );
};

/**
 * Utility function to assert SignIn menu text is in correct language (french or english)
 * @param {String} language -- language to validate (ISO639 codes only, eg. "fra,eng")
 */
export const assertSignInTextLanguage = language => {
    const textToValidate = [];
    cy.get(signInTitleText).then($text => textToValidate.push($text.text()));
    cy.get(signInFormLabels).then($labels =>
        textToValidate.push($labels.text())
    );
    cy.get(signInSubmitButton).then($button =>
        textToValidate.push($button.text())
    );
    cy.get(forgotPasswordLink).then($link => textToValidate.push($link.text()));
    cy.get(createAccountInitiateButton).then($button => {
        textToValidate.push($button.text());
        expect(validateLanguage(textToValidate.join(','), language)).to.be.true;
    });
};

/**
 * Utility function to assert ForgotPassword menu text is in correct language (french or english)
 * @param {String} language -- language to validate (ISO639 codes only, eg. "fra,eng")
 */
export const assertForgotPasswordTextLanguage = language => {
    const textToValidate = [];
    cy.get(forgotPasswordLink).click();
    cy.get(forgotPasswordTitleText).then($text =>
        textToValidate.push($text.text())
    );
    cy.get(forgotPasswordInstructionsText).then($text =>
        textToValidate.push($text.text())
    );
    cy.get(forgotPasswordForm).within(() => {
        cy.get('label').then($label => textToValidate.push($label.text()));
        cy.get('button').then($button => {
            textToValidate.push($button.text());
            expect(validateLanguage(textToValidate.join(','), language)).to.be
                .true;
        });
    });
};

/**
 * Utility function to assert CreateAccount menu text is in correct language (french or english)
 * @param {String} language -- language to validate (ISO639 codes only, eg. "fra,eng")
 */
export const assertCreateAccountTextLanguage = language => {
    const textToValidate = [];
    cy.get(createAccountInitiateButton).click();
    cy.get(createAccountTitle).then($title =>
        textToValidate.push($title.text())
    );
    cy.get(createAccountFormLabels).then($labels =>
        textToValidate.push($labels.text())
    );
    cy.get(createAccountSubmitButton).then($button =>
        textToValidate.push($button.text())
    );
    cy.get(createAccountCancelButton).then($button => {
        textToValidate.push($button.text());
        expect(validateLanguage(textToValidate.join(','), language)).to.be.true;
    });
};
