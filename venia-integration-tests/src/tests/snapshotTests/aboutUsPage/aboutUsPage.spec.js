import {
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    homePage as homePageFixtures
} from '../../../fixtures';
import { clickOnfooterLinks } from '../../../actions/footer';

const { getCMSPage } = graphqlMockedCallsFixtures;

describe(
    'About Us Page',
    { tags: ['@commerce', '@open-source', '@ci', '@aboutus', '@snapshot'] },
    () => {
        it('Verify content', () => {
            cy.visit(homePageFixtures.homePage);
            cy.scrollTo('bottom');
            clickOnfooterLinks('About Us');
            cy.intercept('GET', getCMSPage, {
                fixture: 'aboutUsPage/aboutUsPage.json'
            }).as('getCMSMockData');
            cy.wait(['@getCMSMockData']).its('response.body');
            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'AboutUs',
                    timeout: 60000
                });
            });
        });
    }
);
