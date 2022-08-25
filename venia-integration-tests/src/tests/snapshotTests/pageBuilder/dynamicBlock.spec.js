import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getCMSPage, getDynamicBlocksCall } = graphqlMockedCallsFixtures;

describe(
    'Verify pagebuilder dynamic block content is rendered correctly',
    { tags: ['@commerce', '@ci', '@pagebuilder', '@snapshot'] },
    () => {
        it('verify dynamic block content', () => {
            cy.intercept('GET', getCMSPage, {
                fixture: 'pageBuilder/dynamicBlock/dynamicBlock.json'
            }).as('gqlGetCMSMockData');
            cy.intercept(
                'GET',
                getDynamicBlocksCall + encodeURIComponent('mock-3') + '*',
                {
                    fixture: 'pageBuilder/dynamicBlock/dynamicBlock-mock-3.json'
                }
            ).as('gqlGetDynamicBlockMock3');

            cy.visit('/');
            cy.wait(['@gqlGetCMSMockData']).its('response.body');
            cy.wait(['@gqlGetDynamicBlockMock3']);

            cy.loadFullPage().then(() => {
                cy.captureFullPageScreenshot({
                    name: 'Page Builder Dynamic Block Snapshot',
                    timeout: 60000
                });
            });
        });
    }
);
