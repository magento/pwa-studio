import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';

import {
    categoryPage as categoryPageActions,
    header as headerActions
} from '../../../actions';

import { header as headerAssertions } from '../../../assertions';

const { searchCarina } = categoryPageFixtures;

const { carinaCardigan, semperBangleSet } = productPageFixtures;

const { addProductToCartFromCategoryPage } = categoryPageActions;

const { assertCartIsEmpty, assertCartTriggerCount } = headerAssertions;

const { triggerSearch, searchFromSearchBar } = headerActions;

const {
    getProductDetailForProductPageCall,
    getProductFiltersBySearchCall,
    getProductSearchCall,
    getStoreConfigDataForGalleryEECall
} = graphqlMockedCallsFixtures;

describe('Verify Cart actions', () => {
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

        cy.intercept('GET', getStoreConfigDataForGalleryEECall).as(
            'gqlGetStoreConfigDataForGallery'
        );

        cy.visitHomePage();

        triggerSearch();
        searchFromSearchBar(searchCarina);
        cy.wait(
            ['@gqlGetProductFiltersBySearchQuery', '@gqlGetProductSearchQuery'],
            {
                timeout: 60000
            }
        );

        cy.wait(['@gqlGetStoreConfigDataForGallery'], {
            timeout: 60000
        });

        addProductToCartFromCategoryPage(carinaCardigan.name);
        cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
            timeout: 60000
        });
        cy.checkUrlPath(carinaCardigan.url);
        assertCartIsEmpty();
        triggerSearch();
        searchFromSearchBar('Semper');
        cy.wait(
            ['@gqlGetProductFiltersBySearchQuery', '@gqlGetProductSearchQuery'],
            {
                timeout: 60000
            }
        );
        addProductToCartFromCategoryPage(semperBangleSet.name);

        assertCartTriggerCount(1);
    });
});
