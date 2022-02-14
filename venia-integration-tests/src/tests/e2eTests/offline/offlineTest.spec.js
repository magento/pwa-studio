import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';

import {
    header as headerActions,
    offline as offlineActions
} from '../../../actions';

import {
    categoryPage as categoryPageAssertions,
    toast as toastAssertions,
    offline as offlineAssertions
} from '../../../assertions';

const {
    categorySweaters,
    productCarinaCardigan,
    searchData
} = categoryPageFixtures;

const { carinaCardigan } = productPageFixtures;

const { triggerSearch, searchFromSearchBar } = headerActions;

const { checkServiceWorker } = offlineActions;

const {
    assertProductIsInProductSuggestion,
    assertProductIsInGallery
} = categoryPageAssertions;

const { assertToastExists, assertToastMessage } = toastAssertions;

const {
    assertOffline,
    assertOnline,
    assertServiceWorkerIsActivated
} = offlineAssertions;

const {
    getCategoriesCall,
    getProductDetailForProductPageCall,
    getStoreConfigDataForGalleryEECall,
    getProductFiltersBySearchCall,
    getProductSearchCall,
    getAutocompleteResultsCall,
    getStoreConfigDataCall
} = graphqlMockedCallsFixtures;

describe('PWA-1085: Verify cached pages are rendered correctly on offline mode', () => {
    it('user should be able to navigate on offline mode', () => {
        cy.intercept('GET', getCategoriesCall).as('gqlGetCategoriesQuery');

        cy.intercept('GET', getProductDetailForProductPageCall).as(
            'gqlGetProductDetailForProductPageQuery'
        );

        cy.intercept('GET', getStoreConfigDataCall).as(
            'gqlGetStoreConfigDataQuery'
        );

        cy.intercept('GET', getStoreConfigDataForGalleryEECall).as(
            'gqlGetStoreConfigDataForGallery'
        );

        cy.intercept('GET', getProductFiltersBySearchCall).as(
            'gqlGetProductFiltersBySearchQuery'
        );

        cy.intercept('GET', getProductSearchCall).as(
            'gqlGetProductSearchQuery'
        );

        cy.intercept('GET', getAutocompleteResultsCall).as(
            'gqlGetAutoCompleteResultsQuery'
        );

        cy.visitHomePage();
        cy.wait(['@gqlGetStoreConfigDataQuery'], {
            timeout: 60000
        });

        cy.visitHomePage().then(() => {
            const status = checkServiceWorker();
            assertServiceWorkerIsActivated(status);
        });

        cy.visit(categorySweaters);

        cy.wait(['@gqlGetCategoriesQuery'], {
            timeout: 60000
        });

        cy.wait(['@gqlGetStoreConfigDataForGallery'], {
            timeout: 60000
        });

        triggerSearch();
        searchFromSearchBar(searchData.validSku1, false);

        cy.wait(['@gqlGetAutoCompleteResultsQuery'], {
            timeout: 60000
        });

        cy.visit(categorySweaters);
        cy.wait(4000);

        cy.wait(['@gqlGetCategoriesQuery'], {
            timeout: 60000
        });

        cy.wait(['@gqlGetStoreConfigDataForGallery'], {
            timeout: 60000
        });

        triggerSearch();
        searchFromSearchBar(searchData.validSku1, false);

        cy.wait(['@gqlGetAutoCompleteResultsQuery'], {
            timeout: 60000
        });

        assertProductIsInProductSuggestion(
            searchData.validProductName1,
            searchData.validProductHref1
        );

        assertProductIsInGallery(productCarinaCardigan);

        cy.visit(carinaCardigan.url);
        cy.wait(4000);
        cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
            timeout: 60000
        });

        cy.visitHomePage();

        cy.goOffline();
        assertOffline();

        assertToastExists();

        cy.goOnline();
        assertOnline();

        cy.goOffline();
        assertOffline();
        assertToastMessage(
            'You are offline. Some features may be unavailable.'
        );

        cy.goOnline();
        assertOnline();
        cy.goOffline();
        assertOffline();

        cy.goOnline();
        assertOnline();

        cy.wait(['@gqlGetCategoriesQuery'], {
            timeout: 60000
        });

        cy.goOffline();
        assertOffline();
        cy.visit(categorySweaters);

        triggerSearch();

        cy.goOnline();
        assertOnline();

        cy.goOffline();
        assertOffline();
        searchFromSearchBar(searchData.validSku1, false);

        cy.wait(4000);

        cy.goOnline();
        assertOnline();

        cy.goOffline();
        assertOffline();
        assertProductIsInProductSuggestion(
            searchData.validProductName1,
            searchData.validProductHref1
        );

        cy.goOnline();
        assertOnline();
        cy.goOffline();
        assertOffline();
        assertProductIsInGallery(productCarinaCardigan);

        cy.goOnline();
        assertOnline();
        cy.goOffline();
        assertOffline();
        cy.visit(carinaCardigan.url);

        cy.goOnline();
        assertOnline();
    });
});
