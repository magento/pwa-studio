import { footerLinks } from '../../fields/footer';

/**
 * Click on first anchor element containing link
 *
 * @param {String} label text of the link
 */

export const clickOnfooterLinks = label => {
    cy.get(footerLinks)
        .contains(label)
        .click();
};
