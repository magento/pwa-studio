import { megaMenuRoot, megaMenuItem } from '../../fields/megaMenu';

export const assertCategoryInMegaMenu = categoryText => {
    cy.get(megaMenuRoot).within(() => {
        cy.get(megaMenuItem).contains(categoryText);
    });
};

export const assertNumberOfCategoriesInMegaMenu = number => {
    cy.get(megaMenuRoot).within(() => {
        cy.get(megaMenuItem).should('have.length', number);
    });
};
