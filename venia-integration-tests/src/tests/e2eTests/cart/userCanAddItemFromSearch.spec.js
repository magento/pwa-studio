import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';

import {
    header as headerActions,
    searchPage as searchPageActions
} from '../../../actions';

import { header as headerAssertions } from '../../../assertions';

const { searchCarina } = categoryPageFixtures;

const { carinaCardigan, semperBangleSet } = productPageFixtures;

const { assertCartIsEmpty, assertCartTriggerCount } = headerAssertions;

const { triggerSearch, searchFromSearchBar } = headerActions;

const { addProductToCartFromSearchPage } = searchPageActions;

const {
    getProductDetailForProductPageCall,
    getProductFiltersBySearchCall,
    getProductSearchCall,
    getStoreConfigDataForGalleryACCall
} = graphqlMockedCallsFixtures;

describe(
    'Verify Add to cart actions from search page',
    { tags: ['@e2e', '@commerce', '@open-source', '@ci', '@cart'] },
    () => {
        it("User shouldn't be able to add a CustomizableProduct from search", () => {
            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );

            cy.intercept('GET', getProductFiltersBySearchCall).as(
                'gqlGetProductFiltersBySearchQuery'
            );

            cy.intercept('GET', getProductSearchCall).as(
                'gqlGetProductSearchQuery'
            );

            cy.intercept('GET', getStoreConfigDataForGalleryACCall).as(
                'gqlGetStoreConfigDataForGallery'
            );

            cy.visitHomePage();

            triggerSearch();
            searchFromSearchBar(searchCarina);
            cy.wait(
                [
                    '@gqlGetProductFiltersBySearchQuery',
                    '@gqlGetProductSearchQuery'
                ],
                {
                    timeout: 60000
                }
            );

            cy.wait(['@gqlGetStoreConfigDataForGallery'], {
                timeout: 60000
            });

            addProductToCartFromSearchPage(carinaCardigan.name);
            cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
                timeout: 60000
            });
            cy.checkUrlPath(carinaCardigan.url);
            assertCartIsEmpty();
            triggerSearch();
            searchFromSearchBar('Semper');
            cy.wait(
                [
                    '@gqlGetProductFiltersBySearchQuery',
                    '@gqlGetProductSearchQuery'
                ],
                {
                    timeout: 60000
                }
            );
            addProductToCartFromSearchPage(semperBangleSet.name);

            assertCartTriggerCount(1);
        });
    }
);
