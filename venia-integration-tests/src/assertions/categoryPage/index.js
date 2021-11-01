import {
    categoryPageCategoryContentTitle,
    categoryPageSelectedWishlistButton,
    categoryTreeBranchTarget,
    categoryTreeLeafTarget,
    megaMenuMegaMenuItemLink,
    megaMenuSubmenuColumnLink
} from '../../fields/categoryPage';

/**
 * Utility function to assert selected product in wishlist
 */
export const assertWishlistSelectedProductOnCategoryPage = selectedProduct => {
    // assert product selected indicator
    cy.contains(selectedProduct)
        .siblings()
        .find(categoryPageSelectedWishlistButton)
        .should('exist');
};

/**
 * Assert Category Title
 *
 * @param {String} categoryName category name
 */
export const assertCategoryTitle = categoryName => {
    cy.get(categoryPageCategoryContentTitle).should('contain', categoryName);
};

/**
 * Assert Category Tree contains a Category
 *
 * @param {String} categoryName category name
 */
export const assertCategoryInTree = categoryName => {
    cy.get(`${categoryTreeBranchTarget}, ${categoryTreeLeafTarget}`)
        .should('be.visible')
        .and('contain', categoryName);
};

/**
 * Assert Mega Menu contains a Category
 *
 * @param {String} categoryName category name
 */
export const assertCategoryInMegaMenu = categoryName => {
    cy.get(`${megaMenuMegaMenuItemLink}, ${megaMenuSubmenuColumnLink}`)
        .should('be.visible')
        .and('contain', categoryName);
};
