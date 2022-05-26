import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';
import {
    categoryPage as categoryPageActions,
    header as headerActions
} from '../../../actions';
import { categoryPage as categoryPageAssertions } from '../../../assertions';

const { categoryTops, searchData, sortData } = categoryPageFixtures;
const {
    getCategoriesCall,
    getCategoryDataCall,
    getProductSearchCall
} = graphqlMockedCallsFixtures;

const { toggleProductSort, goToPage, sortProducts } = categoryPageActions;
const { triggerSearch, searchFromSearchBar } = headerActions;

const {
    assertCategoryTitle,
    assertActiveSortItem,
    assertPaginationActivePage
} = categoryPageAssertions;

describe(
    'PWA-1410: verify sort and pagination',
    {
        tags: [
            '@e2e',
            '@commerce',
            '@open-source',
            '@ci',
            '@category',
            '@sort',
            '@pagination'
        ]
    },
    () => {
        it('user should be able to sort products and use pagination', () => {
            cy.intercept('GET', getCategoriesCall).as('gqlGetCategoriesQuery');
            cy.intercept('GET', getCategoryDataCall).as(
                'gqlGetCategoryDataQuery'
            );
            cy.intercept('GET', getProductSearchCall).as(
                'gqlGetProductSearchQuery'
            );

            // Test - Add simple product to cart from Product Page
            cy.visit(categoryTops.url);

            cy.wait(['@gqlGetCategoriesQuery', '@gqlGetCategoryDataQuery'], {
                timeout: 60000
            });

            assertCategoryTitle(categoryTops.name);

            // Test - Sort by price low to high
            toggleProductSort();
            sortProducts(sortData.priceLowHigh);

            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });

            toggleProductSort();
            assertActiveSortItem(sortData.priceLowHigh);

            // Test - Pagination navigation
            goToPage(2);

            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });

            assertPaginationActivePage(2);

            // Test - Sort by price high to low
            toggleProductSort();
            sortProducts(sortData.priceHighLow);

            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });

            toggleProductSort();
            assertActiveSortItem(sortData.priceHighLow);
            assertPaginationActivePage(1);

            // Test - Sort by best match
            sortProducts(sortData.bestMatch);

            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });

            toggleProductSort();
            assertActiveSortItem(sortData.bestMatch);
            assertPaginationActivePage(1);

            // Test - Search Page
            triggerSearch();
            searchFromSearchBar(searchData.validCategoryName);

            cy.wait(['@gqlGetProductSearchQuery'], {
                timeout: 60000
            });

            toggleProductSort();
            assertActiveSortItem(sortData.bestMatch);
            sortProducts(sortData.priceLowHigh);

            cy.wait(['@gqlGetProductSearchQuery'], {
                timeout: 60000
            });

            toggleProductSort();
            assertActiveSortItem(sortData.priceLowHigh);
            assertPaginationActivePage(1);
            goToPage(2);

            cy.wait(['@gqlGetProductSearchQuery'], {
                timeout: 60000
            });

            assertPaginationActivePage(2);
        });
    }
);
