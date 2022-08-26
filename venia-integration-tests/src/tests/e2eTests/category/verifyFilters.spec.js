import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';
import {
    categoryPage as categoryPageActions,
    header as headerActions
} from '../../../actions';
import { categoryPage as categoryPageAssertions } from '../../../assertions';
import {
    assertBooleanFilterUnselectedInputState,
    assertNotInCurrentFilter
} from '../../../assertions/categoryPage';
import {
    assertUrlContains,
    assertUrlDoesNotContains
} from '../../../assertions/app';

const { categoryTops, categoryAccessories, filtersData } = categoryPageFixtures;
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
    assertPaginationActivePage,
    assertNumberOfProductsInResults,
    assertCurrentFilter,
    assertBooleanFilterInputState
} = categoryPageAssertions;

describe(
    'PWA-1402: verify filter actions',
    {
        tags: [
            '@e2e',
            '@commerce',
            '@open-source',
            '@ci',
            '@category',
            '@filter'
        ]
    },
    () => {
        it('user should be able to filter results in Category and Search pages', () => {
            cy.intercept('GET', getCategoriesCall).as('gqlGetCategoriesQuery');
            cy.intercept('GET', getCategoryDataCall).as(
                'gqlGetCategoryDataQuery'
            );
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
                [
                    '@gqlGetProductFiltersBySearchQuery',
                    '@gqlGetProductSearchQuery'
                ],
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
                [
                    '@gqlGetProductFiltersBySearchQuery',
                    '@gqlGetProductSearchQuery'
                ],
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
            /* This part of the test is currently breaking and related to PWA-2948
                TODO: Uncomment this and test when a solution has been applied to the issue
            selectFilterFromList(
                filtersData.category.name,
                filtersData.category.defaultOption
            );
            */
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

        it('user should be able to use radio-boolean filter results in Category and Search pages', () => {
            cy.intercept('GET', getCategoriesCall).as('gqlGetCategoriesQuery');
            cy.intercept('GET', getCategoryDataCall).as(
                'gqlGetCategoryDataQuery'
            );
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
            cy.visit(categoryAccessories.url);

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

            assertCategoryTitle(categoryAccessories.name);

            // Test - Desktop - Add and clear Has Video filter
            let isMobile = false;
            // Add price filter to keep filter list in place
            selectFilterFromList(
                filtersData.price.name,
                filtersData.price.otherOption,
                isMobile
            );

            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });

            assertBooleanFilterUnselectedInputState(
                filtersData.hasVideo.name,
                isMobile
            );
            selectFilterFromList(
                filtersData.hasVideo.name,
                'No',
                isMobile,
                true
            );

            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });
            assertCurrentFilter(filtersData.hasVideo.noLabel, isMobile);
            assertNotInCurrentFilter(filtersData.hasVideo.yesLabel, isMobile);
            assertNumberOfProductsInResults();
            assertUrlContains(filtersData.hasVideo.defaultOption);
            assertUrlContains(filtersData.hasVideo.urlString);
            assertBooleanFilterInputState(
                filtersData.hasVideo.name,
                isMobile,
                false
            );

            selectFilterFromList(
                filtersData.hasVideo.name,
                'Yes',
                isMobile,
                true
            );

            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });

            assertCurrentFilter(filtersData.hasVideo.yesLabel, isMobile);
            assertNotInCurrentFilter(filtersData.hasVideo.noLabel, isMobile);
            assertNumberOfProductsInResults();
            assertUrlContains(filtersData.hasVideo.optionYes);
            assertUrlContains(filtersData.hasVideo.urlString);
            assertBooleanFilterInputState(
                filtersData.hasVideo.name,
                isMobile,
                true
            );

            clearFilters(isMobile);

            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });

            assertNumberOfProductsInResults();
            assertUrlDoesNotContains(filtersData.hasVideo.optionYes);
            assertUrlDoesNotContains(filtersData.hasVideo.urlString);
            assertBooleanFilterUnselectedInputState(
                filtersData.hasVideo.name,
                isMobile
            );
            // Test - Mobile - Add and clear Has Video filter
            isMobile = true;
            cy.viewport(375, 812);
            cy.visit(categoryAccessories.url);

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

            toggleFilterModal();
            // Add price filter to keep filter list in place
            selectFilterFromList(
                filtersData.price.name,
                filtersData.price.otherOption,
                isMobile
            );
            assertNotInCurrentFilter(filtersData.hasVideo.yesLabel);
            assertNotInCurrentFilter(filtersData.hasVideo.noLabel);
            assertBooleanFilterUnselectedInputState(
                filtersData.hasVideo.name,
                isMobile
            );
            selectFilterFromList(filtersData.hasVideo.name, 'No', true, true);
            assertNotInCurrentFilter(filtersData.hasVideo.yesLabel);
            assertCurrentFilter(filtersData.hasVideo.noLabel);
            assertBooleanFilterInputState(
                filtersData.hasVideo.name,
                isMobile,
                false
            );
            applyFiltersFromFilterModal();

            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });

            assertCategoryTitle(categoryAccessories.name);
            assertNumberOfProductsInResults();
            assertUrlContains(filtersData.hasVideo.defaultOption);
            assertUrlContains(filtersData.hasVideo.urlString);

            toggleFilterModal();
            assertNotInCurrentFilter(filtersData.hasVideo.yesLabel);
            assertCurrentFilter(filtersData.hasVideo.noLabel);
            assertBooleanFilterInputState(
                filtersData.hasVideo.name,
                isMobile,
                false
            );
            selectFilterFromList(filtersData.hasVideo.name, 'Yes', true, true);
            assertCurrentFilter(filtersData.hasVideo.yesLabel);
            assertNotInCurrentFilter(filtersData.hasVideo.noLabel);
            assertBooleanFilterInputState(
                filtersData.hasVideo.name,
                isMobile,
                true
            );
            applyFiltersFromFilterModal();

            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });

            assertCategoryTitle(categoryAccessories.name);
            assertNumberOfProductsInResults();
            assertUrlContains(filtersData.hasVideo.optionYes);
            assertUrlContains(filtersData.hasVideo.urlString);

            toggleFilterModal();
            clearFilter(filtersData.hasVideo.yesLabel);
            assertNotInCurrentFilter(filtersData.hasVideo.yesLabel);
            assertNotInCurrentFilter(filtersData.hasVideo.noLabel);
            assertBooleanFilterUnselectedInputState(
                filtersData.hasVideo.name,
                isMobile
            );

            applyFiltersFromFilterModal();

            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });
            assertNumberOfProductsInResults();
            assertUrlContains(filtersData.price.urlString);
            assertUrlContains(filtersData.price.otherOption);

            //Clean Up
            toggleFilterModal();
            clearFilters();
            applyFiltersFromFilterModal();

            cy.wait(['@gqlGetCategoriesQuery'], {
                timeout: 60000
            });

            assertNumberOfProductsInResults();
            assertUrlDoesNotContains(filtersData.price.urlString);
            assertUrlDoesNotContains(filtersData.price.otherOption);
        });
    }
);
