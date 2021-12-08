import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';
import { header as headerActions } from '../../../actions';
import { categoryPage as categoryPageAssertions } from '../../../assertions';

const { searchData } = categoryPageFixtures;
const {
    getAutocompleteResultsCall,
    getProductFiltersBySearchCall,
    getProductSearchCall
} = graphqlMockedCallsFixtures;

const { triggerSearch, searchFromSearchBar } = headerActions;

const {
    assertProductIsInProductSuggestion,
    assertNoProductSuggestion
} = categoryPageAssertions;

// TODO add tags CE, EE to test to filter and run tests as needed
describe('PWA-1400: verify category actions', () => {
    it('user should be able search with different inputs and view different suggestions', () => {
        cy.intercept('GET', getAutocompleteResultsCall).as(
            'gqlGetAutocompleteResultsQuery'
        );
        cy.intercept('GET', getProductFiltersBySearchCall).as(
            'gqlGetProductFiltersBySearchQuery'
        );
        cy.intercept('GET', getProductSearchCall).as(
            'gqlGetProductSearchQuery'
        );

        cy.visitHomePage();

        // Test - Search by valid SKU - 1
        triggerSearch();
        searchFromSearchBar(searchData.validSku1, false);

        cy.wait(['@gqlGetAutocompleteResultsQuery'], {
            timeout: 60000
        });

        assertProductIsInProductSuggestion(
            searchData.validProductName1,
            searchData.validProductHref1
        );

        // Test - Search by valid SKU - 2
        searchFromSearchBar(searchData.validSku2, false);

        cy.wait(['@gqlGetAutocompleteResultsQuery'], {
            timeout: 60000
        });

        assertProductIsInProductSuggestion(
            searchData.validProductName2,
            searchData.validProductHref2
        );

        // Test - Search by invalid SKU
        searchFromSearchBar(searchData.invalidSku, false);

        cy.wait(['@gqlGetAutocompleteResultsQuery'], {
            timeout: 60000
        });

        assertNoProductSuggestion();
    });
});
