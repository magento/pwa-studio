import {
    headerCartTriggerCount,
    headerStoreSwitcherTriggerButton,
    headerCurrencySwitcherTriggerButton,
    headerStoreSwitcherItemButton,
    headerSwitcherItemSelectedIcon,
    headerCurrencySwitcherItemButton,
    headerSearchTriggerLabel,
    headerAccountTriggerLabel,
    headerSearchAutocompleteMessage,
    headerSearchAutocompleteSuggestionsHeading,
    headerSearchAutocompleteSuggestionPrice
} from '../../fields/header';

import { validateLanguage } from '../../utils/language-test-utils';

/**
 * Utility function to assert Cart is empty
 */
export const assertCartIsEmpty = () => {
    cy.get(headerCartTriggerCount).should('not.exist');
};

/**
 * Utility function to assert Cart Trigger Product count
 *
 * @param {Number} count Cart count
 */
export const assertCartTriggerCount = count => {
    cy.get(headerCartTriggerCount).should('contain', count);
};

export const assertStoreIsDisplayed = store => {
    cy.get(headerStoreSwitcherTriggerButton).should('contain', store);
};

export const assertCurrencyIsDisplayed = currency => {
    cy.get(headerCurrencySwitcherTriggerButton).should('contain', currency);
};

export const assertCurrencyIsNotDisplayed = () => {
    cy.get(headerCurrencySwitcherTriggerButton).should('not.exist');
};

export const assertStoreIsSelected = store => {
    const storeButton = cy.get(headerStoreSwitcherItemButton).contains(store);

    storeButton.get(headerSwitcherItemSelectedIcon).should('exist');
};

export const assertCurrencyIsSelected = currency => {
    const currencyButton = cy
        .get(headerCurrencySwitcherItemButton)
        .contains(currency);

    currencyButton.get(headerSwitcherItemSelectedIcon).should('exist');
};

/**
 * Utility function to assert Header text is in correct language (french or english)
 * @param {String} language -- language to validate (ISO639 codes only, eg. "fra,eng")
 */
export const assertHeaderTextLanguage = language => {
    const textToValidate = [];
    cy.get(headerSearchTriggerLabel).then($label => {
        textToValidate.push($label.text());
    });
    cy.get(headerAccountTriggerLabel).then($label => {
        textToValidate.push($label.text());
    });
    cy.get(headerSearchAutocompleteMessage).then($message => {
        textToValidate.push($message.text());
    });
    cy.get(headerSearchAutocompleteSuggestionsHeading).then($heading => {
        textToValidate.push($heading.text());
        expect(validateLanguage(textToValidate.join(','), language)).to.be.true;
    });
};
/**
 * Utility function to assert products in ProductSuggestions displays correct currency.
 *
 * @param {String} currency -- currency code to validate
 */
export const assertProductSuggestionsHasCurrency = currency => {
    const currencySymbolMap = {
        USD: '$',
        EUR: '€'
    };
    cy.get(headerSearchAutocompleteSuggestionPrice).should(
        'contain',
        currencySymbolMap[currency]
    );
};
