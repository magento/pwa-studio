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
 * @param {Boolean} [submitForm] submit form
 */
export const searchFromSearchBar = (searchString, submitForm = true) => {
    cy.get(searchBarSearchField)
        .clear()
        .type(searchString);

    if (submitForm) {
        cy.get(searchBarSearchField).type('{enter}');

        // Close Search Bar after submit
        triggerSearch();
    }
};
