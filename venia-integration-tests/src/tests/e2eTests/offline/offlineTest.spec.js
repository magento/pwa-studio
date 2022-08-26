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

const { categoryTops, searchData } = categoryPageFixtures;

const {
    selectCategoryFromMegaMenu,
    selectProductFromCategoryPage
} = categoryPageActions;

const { productVitaliaTop, carinaCardigan } = productPageFixtures;

const { triggerSearch, searchFromSearchBar, clickHeaderLogo } = headerActions;

const { assertProductIsInProductSuggestion } = categoryPageAssertions;

const { assertToastExists, assertToastMessage } = toastAssertions;

const { assertOffline, assertServiceWorkerIsActivated } = offlineAssertions;

const {
    getProductDetailForProductPageCall,
    getStoreConfigDataForGalleryACCall,
    getProductSearchCall,
    getCategoriesCall,
    getAutocompleteResultsCall,
    getStoreConfigDataCall,
    getCategoryDataCall
} = graphqlMockedCallsFixtures;

const WAIT_TIME = 4000;

beforeEach(() => {
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        assertServiceWorkerIsActivated(
            serviceWorkerRegistration?.active?.state
        );
    });
});

describe(
    'PWA-1085: Verify cached pages are rendered correctly on offline mode',
    { tags: ['@commerce', '@open-source', '@ci', '@offline'] },
    () => {
        it('user should be able to navigate on offline mode', () => {
            cy.intercept('GET', getStoreConfigDataCall).as(
                'gqlGetStoreConfigDataQuery'
            );
            cy.intercept('GET', getStoreConfigDataForGalleryACCall).as(
                'gqlGetStoreConfigDataForGallery'
            );
            cy.intercept('GET', getCategoriesCall).as('gqlGetCategoriesQuery');
            cy.intercept('GET', getCategoryDataCall).as(
                'gqlGetCategoryDataCallQuery'
            );
            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
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

            cy.visit(categoryTops.url);

            cy.wait(
                [
                    '@gqlGetCategoryDataCallQuery',
                    '@gqlGetStoreConfigDataForGallery'
                ],
                {
                    timeout: 60000
                }
            );

            triggerSearch();

            searchFromSearchBar(searchData.validSku1, false);
            cy.wait(['@gqlGetAutoCompleteResultsQuery'], {
                timeout: 60000
            });

            assertProductIsInProductSuggestion(
                searchData.validProductName1,
                searchData.validProductHref1
            );

            cy.visit(categoryTops.url).then(() => cy.wait(WAIT_TIME)); // cy.wait needed to assert that Cypress cached files

            cy.wait(['@gqlGetCategoriesQuery'], {
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

            cy.visit(productVitaliaTop.url).then(() => cy.wait(WAIT_TIME));

            cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
                timeout: 60000
            });

            selectCategoryFromMegaMenu(categoryTops.name);

            selectProductFromCategoryPage(carinaCardigan.name);

            cy.visitHomePage();

            cy.goOffline();

            assertOffline();

            assertToastExists();

            assertToastMessage(
                'You are offline. Some features may be unavailable.'
            );

            selectCategoryFromMegaMenu(categoryTops.name);

            selectProductFromCategoryPage(carinaCardigan.name);

            triggerSearch();

            searchFromSearchBar(searchData.validSku1, false);

            assertProductIsInProductSuggestion(
                searchData.validProductName1,
                searchData.validProductHref1
            );

            clickHeaderLogo();
        });
    }
);
