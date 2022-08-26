import {
    categoryTreeListItem,
    categoryTreeRoot
} from '../../fields/categoryTree';

export const assertNumberOfCategoriesInCategoryTree = number => {
    cy.get(categoryTreeRoot).within(() => {
        cy.get(categoryTreeListItem).should('have.length', number);
    });
};

export const assertCategoryInCategoryTree = categoryText => {
    cy.get(categoryTreeRoot).within(() => {
        cy.get(categoryTreeListItem).contains(categoryText);
    });
};
