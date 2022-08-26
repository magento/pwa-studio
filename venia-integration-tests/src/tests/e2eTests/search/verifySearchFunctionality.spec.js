import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';
import { header as headerActions } from '../../../actions';
import { categoryPage as categoryPageAssertions } from '../../../assertions';
import { sortData } from '../../../fixtures/categoryPage';
import {
    assertActiveSortItem,
    assertNotAvailableSortItem
} from '../../../assertions/categoryPage';
import { sortProducts, toggleProductSort } from '../../../actions/categoryPage';

const { searchData } = categoryPageFixtures;
const {
    getProductFiltersBySearchCall,
    getProductSearchCall
} = graphqlMockedCallsFixtures;

const { triggerSearch, searchFromSearchBar } = headerActions;

const {
    assertNoProductsFound,
    assertProductIsInGallery
} = categoryPageAssertions;

describe(
    'PWA-1406: verify user search actions',
    { tags: ['@e2e', '@commerce', '@open-source', '@ci', '@search'] },
    () => {
        it('user should be able search with different inputs', () => {
            cy.intercept('GET', getProductFiltersBySearchCall).as(
                'gqlGetProductFiltersBySearchQuery'
            );
            cy.intercept('GET', getProductSearchCall).as(
                'gqlGetProductSearchQuery'
            );

            cy.visitHomePage();

            // Test - Search by valid SKU - 1
            triggerSearch();
            searchFromSearchBar(searchData.validSku1);
            // Needed to avoid intermittent call being made before cypress even starts waiting for it
            cy.wait(1000);
            cy.wait(
                [
                    '@gqlGetProductFiltersBySearchQuery',
                    '@gqlGetProductSearchQuery'
                ],
                {
                    timeout: 60000
                }
            );

            assertProductIsInGallery(searchData.validProductName1);

            // Test - Position sort not available in search
            toggleProductSort();
            assertNotAvailableSortItem(sortData.position);

            assertActiveSortItem(sortData.bestMatch);

            // Test - Search by valid SKU - 2
            triggerSearch();
            searchFromSearchBar(searchData.validSku2);

            cy.wait(
                [
                    '@gqlGetProductFiltersBySearchQuery',
                    '@gqlGetProductSearchQuery'
                ],
                {
                    timeout: 60000
                }
            );

            assertProductIsInGallery(searchData.validProductName2);

            // Test - Search by invalid SKU
            triggerSearch();
            searchFromSearchBar(searchData.invalidSku);

            cy.wait(
                [
                    '@gqlGetProductFiltersBySearchQuery',
                    '@gqlGetProductSearchQuery'
                ],
                {
                    timeout: 60000
                }
            );

            assertNoProductsFound();

            // Test - Search by valid Product Name
            triggerSearch();
            searchFromSearchBar(searchData.validProductSearch);

            cy.wait(
                [
                    '@gqlGetProductFiltersBySearchQuery',
                    '@gqlGetProductSearchQuery'
                ],
                {
                    timeout: 60000
                }
            );

            assertProductIsInGallery(searchData.validProductName1);

            toggleProductSort();
            sortProducts(sortData.priceHighLow);

            // Test - Position sort not available in search even after changing sort
            toggleProductSort();
            assertActiveSortItem(sortData.priceHighLow);
            assertNotAvailableSortItem(sortData.position);
        });
    }
);
