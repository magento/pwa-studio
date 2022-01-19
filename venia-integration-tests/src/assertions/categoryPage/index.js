import {
    categoryPageSelectedWishlistButton,
    categoryTreeBranchTarget,
    categoryTreeLeafTarget,
    megaMenuMegaMenuItemLink,
    megaMenuSubmenuColumnLink,
    categoryContentTitle,
    productsGalleryItemName,
    productsNoProductsFound,
    productsPagination,
    productsPaginationTileActive,
    productRatingSummary,
    productSortSortItemActive,
    searchBarSuggestedProduct
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
    cy.get(categoryContentTitle).should('contain', categoryName);
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

/**
 * Assert products were found
 */
export const assertProductsFound = () => {
    cy.get(productsNoProductsFound).should('not.exist');
};

/**
 * Assert no products were found
 */
export const assertNoProductsFound = () => {
    cy.get(productsNoProductsFound).should('exist');
};

/**
 * Assert pagination is not present
 */
export const assertNoPagination = () => {
    cy.get(productsPagination).should('not.exist');
};

/**
 * Assert current pagination's active page
 *
 * @param {Number} pageNumber page number
 */
export const assertPaginationActivePage = pageNumber => {
    cy.get(productsPaginationTileActive).should('contain', pageNumber);
};

/**
 * Assert Product is in Gallery
 *
 * @param {String} productName product name
 */
export const assertProductIsInGallery = productName => {
    cy.get(productsGalleryItemName).should('contain', productName);
};

/**
 * Assert Product is in Product Suggestion
 *
 * @param {String} productName product name
 * @param {String} productHref product href
 */
export const assertProductIsInProductSuggestion = (
    productName,
    productHref
) => {
    cy.get(searchBarSuggestedProduct).should('contain', productName);
    cy.get(searchBarSuggestedProduct)
        .invoke('attr', 'href')
        .should('contain', productHref);
};

/**
 * Assert no Product Suggestion
 */
export const assertNoProductSuggestion = () => {
    cy.get(searchBarSuggestedProduct).should('not.exist');
};

/**
 * Assert active Sort Item
 *
 * @param {String} sortLabel product name
 */
export const assertActiveSortItem = sortLabel => {
    cy.get(productSortSortItemActive).should('contain', sortLabel);
};

export const assertRatingSummary = productName => {
    cy.contains(productName)
        .children()
        .get(productRatingSummary)
        .should('exist');
};
