import { pageBuilderBanner } from '../../fields/pageBuilder';

/**
 * Click on first Banner element containing text
 *
 * @param {String} text text of the button
 */
export const clickOnBannerElementContaining = text => {
    cy.get(pageBuilderBanner)
        .contains(text)
        .first()
        .click();
};
