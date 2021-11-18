import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';
import { header as headerActions } from '../../../actions';
import { categoryPage as categoryPageAssertions } from '../../../assertions';

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

// TODO add tags CE, EE to test to filter and run tests as needed
describe('PWA-1406: verify category actions', () => {
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

        cy.wait(
            ['@gqlGetProductFiltersBySearchQuery', '@gqlGetProductSearchQuery'],
            {
                timeout: 60000
            }
        );

        assertProductIsInGallery(searchData.validProductName1);

        // Test - Search by valid SKU - 2
        triggerSearch();
        searchFromSearchBar(searchData.validSku2);

        cy.wait(
            ['@gqlGetProductFiltersBySearchQuery', '@gqlGetProductSearchQuery'],
            {
                timeout: 60000
            }
        );

        assertProductIsInGallery(searchData.validProductName2);

        // Test - Search by invalid SKU
        triggerSearch();
        searchFromSearchBar(searchData.invalidSku);

        cy.wait(
            ['@gqlGetProductFiltersBySearchQuery', '@gqlGetProductSearchQuery'],
            {
                timeout: 60000
            }
        );

        assertNoProductsFound();

        // Test - Search by valid Product Name
        triggerSearch();
        searchFromSearchBar(searchData.validProductName1);

        cy.wait(
            ['@gqlGetProductFiltersBySearchQuery', '@gqlGetProductSearchQuery'],
            {
                timeout: 60000
            }
        );

        assertProductIsInGallery(searchData.validProductName1);
    });
});
