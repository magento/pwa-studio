import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';
import {
    categoryPage as categoryPageActions,
    header as headerActions
} from '../../../actions';
import { categoryPage as categoryPageAssertions } from '../../../assertions';

const { categoryTops, filtersData } = categoryPageFixtures;
const {
    getCategoriesCall,
    getCategoryDataCall,
    getProductFiltersByCategoryCall,
    getProductFiltersBySearchCall,
    getProductSearchCall
} = graphqlMockedCallsFixtures;

const {
    clearFilter,
    clearFilters,
    toggleFilterList,
    selectFilterFromList,
    toggleFilterBlock,
    toggleFilterModal,
    applyFiltersFromFilterModal
} = categoryPageActions;
const { triggerSearch, searchFromSearchBar } = headerActions;

const {
    assertCategoryTitle,
    assertProductsFound,
    assertNoProductsFound,
    assertNoPagination,
    assertPaginationActivePage
} = categoryPageAssertions;

// TODO add tags CE, EE to test to filter and run tests as needed
describe('PWA-1402: verify category actions', () => {
    it('user should be able to filter results in Category and Search pages', () => {
        cy.intercept('GET', getCategoriesCall).as('gqlGetCategoriesQuery');
        cy.intercept('GET', getCategoryDataCall).as('gqlGetCategoryDataQuery');
        cy.intercept('GET', getProductFiltersByCategoryCall).as(
            'gqlGetProductFiltersByCategoryQuery'
        );
        cy.intercept('GET', getProductFiltersBySearchCall).as(
            'gqlGetProductFiltersBySearchQuery'
        );
        cy.intercept('GET', getProductSearchCall).as(
            'gqlGetProductSearchQuery'
        );

        // Test - Add simple product to cart from Product Page
        cy.visit(categoryTops.url);

        cy.wait(
            [
                '@gqlGetCategoriesQuery',
                '@gqlGetCategoryDataQuery',
                '@gqlGetProductFiltersByCategoryQuery'
            ],
            {
                timeout: 60000
            }
        );

        assertCategoryTitle(categoryTops.name);

        // Test - Desktop - Add and clear Price filter
        selectFilterFromList(
            filtersData.price.name,
            filtersData.price.defaultOption,
            false
        );

        cy.wait(['@gqlGetCategoriesQuery'], {
            timeout: 60000
        });

        assertNoPagination();
        clearFilters(false);

        cy.wait(['@gqlGetCategoriesQuery'], {
            timeout: 60000
        });

        assertCategoryTitle(categoryTops.name);
        assertPaginationActivePage(1);

        // Test - Desktop - Add Color and Material filters
        toggleFilterList(filtersData.color.name, false);
        selectFilterFromList(
            filtersData.color.name,
            filtersData.color.defaultOption,
            false
        );
        toggleFilterList(filtersData.material.name, false);
        selectFilterFromList(
            filtersData.material.name,
            filtersData.material.defaultOption,
            false
        );

        assertNoProductsFound();

        // Test - Desktop - Search for category Top and filter results
        triggerSearch();
        searchFromSearchBar(categoryTops.name);

        cy.wait(
            ['@gqlGetProductFiltersBySearchQuery', '@gqlGetProductSearchQuery'],
            {
                timeout: 60000
            }
        );

        selectFilterFromList(
            filtersData.price.name,
            filtersData.price.defaultOption,
            false
        );
        selectFilterFromList(
            filtersData.category.name,
            filtersData.category.defaultOption,
            false
        );
        assertProductsFound();
        assertNoPagination();
        clearFilters(false);

        cy.wait(['@gqlGetProductSearchQuery'], {
            timeout: 60000
        });

        assertPaginationActivePage(1);

        // Test - Mobile - Add and clear Price filter
        cy.viewport(375, 812);
        cy.visit(categoryTops.url);

        cy.wait(
            [
                '@gqlGetCategoriesQuery',
                '@gqlGetCategoryDataQuery',
                '@gqlGetProductFiltersByCategoryQuery'
            ],
            {
                timeout: 60000
            }
        );

        // Test - Mobile - Add and clear Price filter
        toggleFilterModal();
        toggleFilterBlock(filtersData.price.name);
        selectFilterFromList(
            filtersData.price.name,
            filtersData.price.defaultOption
        );
        applyFiltersFromFilterModal();

        cy.wait(['@gqlGetCategoriesQuery'], {
            timeout: 60000
        });

        assertCategoryTitle(categoryTops.name);
        assertNoPagination();
        toggleFilterModal();
        clearFilter(filtersData.price.defaultOption);
        applyFiltersFromFilterModal();

        cy.wait(['@gqlGetCategoriesQuery'], {
            timeout: 60000
        });

        // Test - Mobile - Add Color and Material filters
        toggleFilterModal();
        toggleFilterBlock(filtersData.color.name);
        toggleFilterList(filtersData.color.name);
        selectFilterFromList(
            filtersData.color.name,
            filtersData.color.defaultOption
        );
        toggleFilterBlock(filtersData.material.name);
        toggleFilterList(filtersData.material.name);
        selectFilterFromList(
            filtersData.material.name,
            filtersData.material.defaultOption
        );
        applyFiltersFromFilterModal();

        cy.wait(['@gqlGetCategoriesQuery'], {
            timeout: 60000
        });

        assertNoProductsFound();

        // Test - Mobile - Search for category Top and filter results
        triggerSearch();
        searchFromSearchBar(categoryTops.name);

        cy.wait(
            ['@gqlGetProductFiltersBySearchQuery', '@gqlGetProductSearchQuery'],
            {
                timeout: 60000
            }
        );

        toggleFilterModal();
        toggleFilterBlock(filtersData.price.name);
        selectFilterFromList(
            filtersData.price.name,
            filtersData.price.defaultOption
        );
        applyFiltersFromFilterModal();
        toggleFilterModal();
        toggleFilterBlock(filtersData.category.name);
        selectFilterFromList(
            filtersData.category.name,
            filtersData.category.defaultOption
        );
        applyFiltersFromFilterModal();
        assertProductsFound();
        assertNoPagination();
        toggleFilterModal();
        clearFilters();
        applyFiltersFromFilterModal();

        cy.wait(['@gqlGetProductSearchQuery'], {
            timeout: 60000
        });

        assertPaginationActivePage(1);
    });
});
