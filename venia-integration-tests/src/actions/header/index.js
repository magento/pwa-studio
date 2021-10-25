import { headerSearchTrigger, searchBarSearchField } from '../../fields/header';

/**
 * Utility function to trigger search
 */
export const triggerSearch = () => {
    cy.get(headerSearchTrigger).click();
};

/**
 * Utility function to search element
 *
 * @param {String} searchString string to search for
 */
export const searchFromSearchBar = searchString => {
    cy.get(searchBarSearchField)
        .clear()
        .type(searchString)
        .type('{enter}');
};
