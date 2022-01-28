import {
    headerStoreSwitcherGroup,
    headerStoreSwitcherTrigger
} from '../../fields/storeSwitcher';

export const toggleHeaderStoreSwitcher = () => {
    cy.get(headerStoreSwitcherTrigger).click();
};

export const selectStoreView = label => {
    cy.get(headerStoreSwitcherGroup)
        .contains(label)
        .click();
};
