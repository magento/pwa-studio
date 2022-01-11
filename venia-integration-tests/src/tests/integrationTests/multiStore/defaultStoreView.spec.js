import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
const { getStoreConfigData, getStoreName } = graphqlMockedCallsFixtures;

describe('PWA-1408: Verify data displayed is from Default Root Category', () => {
    it('displays subcategories from the default root category', () => {
        cy.intercept('GET', getStoreName, {
            fixture: 'multiStore/storeName.json'
        }).as('getMockStoreName');

        cy.intercept('GET', getStoreConfigData, {
            fixture: 'multiStore/storeConfig.json'
        }).as('getMockStoreConfig');

        cy.visitPage('/');
    });
});
