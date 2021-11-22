import {
    homePage as homePageFixtures,
    resource as resourceFixtures
} from '../../../fixtures';

const {
    homePage
} = homePageFixtures;

const {
    clientJs
} = resourceFixtures;


describe('verify version banner', () => {
    it('user can see list of important package versions', () => {
        cy.intercept('GET', clientJs).as('resourceClientJs');

        cy.visit(homePage);
        cy.wait('@resourceClientJs', {
                timeout: 20000
            })
            .its('response.body')
            .should('match', /@version pwa-studio: \d+\.\d+\.\d+/i)
            .should('match', /@magento\/pwa-buildpack: [~^]?\d+\.\d+\.\d+/i)
            .should('match', /@magento\/venia-ui: [~^]?\d+\.\d+\.\d+/i);
    });
});
