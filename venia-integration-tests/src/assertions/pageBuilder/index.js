import { pageBuilderImage } from '../../fields/pageBuilder';

/**
 * Utility function to assert image url contains base url
 */
export const assertImageUrlContainsBaseUrl = () => {
    cy.get(pageBuilderImage)
        .first()
        .should('be.visible')
        .find('img')
        .should('exist')
        .then($img => {
            expect($img[0].src).contains(Cypress.config().baseUrl);
        });
};
