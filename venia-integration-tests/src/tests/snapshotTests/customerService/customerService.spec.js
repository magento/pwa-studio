import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
import { clickOnfooterLinks } from '../../../actions/footer';

const { getCMSPage } = graphqlMockedCallsFixtures;

describe(
    'Customer Service Page',
    {
        tags: [
            '@commerce',
            '@open-source',
            '@ci',
            '@customerservice',
            '@snapshot'
        ]
    },
    () => {
        it('Verify content', () => {
            cy.visitHomePage();
            cy.scrollTo('bottom');
            clickOnfooterLinks('Customer Service');
            cy.intercept('GET', getCMSPage, {
                fixture: 'customerService/customerService.json'
            }).as('getCMSMockData');
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Customer Service Page',
                    timeout: 60000
                });
            });
        });
    }
);
