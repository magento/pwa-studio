import {
    appMaskButton,
    headerNavTrigger,
    headerSearchTrigger,
    searchBarSearchField,
    headerLogo,
    headerStoreSwitcherTriggerButton,
    headerCurrencySwitcherTriggerButton,
    headerStoreSwitcherItemButton,
    headerCurrencySwitcherItemButton,
    headerAccountMenuTrigger
} from '../../fields/header';

/**
 * Utility function to click on logo
 */
export const clickHeaderLogo = () => {
    cy.get(headerLogo).click();
};

export const toggleHeaderNav = () => {
    cy.get(headerNavTrigger).click();
};

export const closeAppMask = () => {
    cy.get(appMaskButton).click({ force: true });
};

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

export const triggerStoreSwitcherMenu = () => {
    cy.get(headerStoreSwitcherTriggerButton).click();
};

export const triggerCurrencySwitcherMenu = () => {
    cy.get(headerCurrencySwitcherTriggerButton).click();
};

export const changeStoreView = store => {
    cy.get(headerStoreSwitcherItemButton)
        .contains(store)
        .click();
};

export const changeCurrency = currency => {
    cy.get(headerCurrencySwitcherItemButton)
        .contains(currency)
        .click();
};

export const triggerAccountMenu = () => {
    cy.get(headerAccountMenuTrigger).click();
};
