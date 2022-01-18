import { validateLanguage } from '../../utils/language-test-utils';
import {
    footerLinks,
    footerLabels,
    footerCalloutHeadingText,
    footerCalloutText,
    footerNewsletterInfoText,
    footerNewsletterSubmitButton,
    footerNewsletterTitleText,
    footerPrivacyText,
    footerTermsText
} from '../../fields/footer';

export const assertFooterLanguageText = language => {
    const textToValidate = [];
    cy.get(footerLinks).then($links => textToValidate.push($links.text()));
    cy.get(footerLabels).then($labels => textToValidate.push($labels.text()));
    cy.get(footerCalloutHeadingText).then($text =>
        textToValidate.push($text.text())
    );
    cy.get(footerCalloutText).then($text => textToValidate.push($text.text()));
    cy.get(footerNewsletterInfoText).then($text =>
        textToValidate.push($text.text())
    );
    cy.get(footerNewsletterTitleText).then($text =>
        textToValidate.push($text.text())
    );
    cy.get(footerPrivacyText).then($text => textToValidate.push($text.text()));
    cy.get(footerTermsText).then($text => textToValidate.push($text.text()));
    cy.get(footerNewsletterSubmitButton).then($button => {
        textToValidate.push($button.text());
        expect(validateLanguage(textToValidate.join(','), language)).to.be.true;
    });
};
