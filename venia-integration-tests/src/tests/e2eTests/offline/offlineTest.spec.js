import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';

import {
    header as headerActions,
    categoryPage as categoryPageActions
} from '../../../actions';

import {
    categoryPage as categoryPageAssertions,
    toast as toastAssertions,
    offline as offlineAssertions
} from '../../../assertions';

const { categoryDresses, searchData } = categoryPageFixtures;

const {
    selectCategoryFromMegaMenu,
    selectProductFromCategoryPage
} = categoryPageActions;

const { productAngelinaTankDress } = productPageFixtures;

const { triggerSearch, searchFromSearchBar } = headerActions;

const {
    assertProductIsInProductSuggestion,
    assertProductIsInGallery
} = categoryPageAssertions;

const { assertToastExists, assertToastMessage } = toastAssertions;

const { assertOffline, assertServiceWorkerIsActivated } = offlineAssertions;

const {
    getCategoriesCall,
    getProductDetailForProductPageCall,
    getStoreConfigDataForGalleryEECall,
    getProductFiltersBySearchCall,
    getProductSearchCall,
    getAutocompleteResultsCall,
    getStoreConfigDataCall,
    getCategoryDataCall
} = graphqlMockedCallsFixtures;

describe('PWA-1085: Verify cached pages are rendered correctly on offline mode', () => {
    before(() => {
        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            assertServiceWorkerIsActivated(
                serviceWorkerRegistration?.active?.state
            );
        });
    });

    it('user should be able to navigate on offline mode', () => {
        cy.intercept('GET', getCategoriesCall).as('gqlGetCategoriesQuery');

        cy.intercept('GET', getProductDetailForProductPageCall).as(
            'gqlGetProductDetailForProductPageQuery'
        );

        cy.intercept('GET', getStoreConfigDataCall).as(
            'gqlGetStoreConfigDataQuery'
        );

        cy.intercept('GET', getCategoryDataCall).as(
            'gqlGetCategoryDataCallQuery'
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

        // called to wait cache load properly
        cy.wait(4000);

        cy.visit(categoryDresses.url);

        cy.wait(['@gqlGetCategoryDataCallQuery'], {
            timeout: 60000
        });

        cy.wait(['@gqlGetCategoriesQuery'], {
            timeout: 60000
        });

        cy.wait(['@gqlGetStoreConfigDataForGallery'], {
            timeout: 60000
        });

        cy.wait(4000);

        triggerSearch();
        searchFromSearchBar(searchData.validSku1, false);

        cy.wait(['@gqlGetAutoCompleteResultsQuery'], {
            timeout: 60000
        });

        cy.visit(categoryDresses.url);
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

        assertProductIsInGallery(productAngelinaTankDress.name);

        cy.visit(productAngelinaTankDress.url);

        cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
            timeout: 60000
        });
        cy.wait(4000);

        cy.visitHomePage();

        cy.goOffline();

        assertOffline();

        assertToastExists();

        assertToastMessage(
            'You are offline. Some features may be unavailable.'
        );

        selectCategoryFromMegaMenu(categoryDresses.name);

        selectProductFromCategoryPage(productAngelinaTankDress.name);

        triggerSearch();

        searchFromSearchBar(searchData.validSku1, false);

        cy.wait(4000);

        assertProductIsInProductSuggestion(
            searchData.validProductName1,
            searchData.validProductHref1
        );
    });
});
