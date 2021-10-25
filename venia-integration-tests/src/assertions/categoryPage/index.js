import {
    categoryPageSelectedWishlistButton,
    categoryContentTitle,
    categoryContentNoProductsFound,
    productsPagination,
    productsPaginationTileActive
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
 * Assert products were found
 */
export const assertProductsFound = () => {
    cy.get(categoryContentNoProductsFound).should('not.exist');
};

/**
 * Assert no products were found
 */
export const assertNoProductsFound = () => {
    cy.get(categoryContentNoProductsFound).should('exist');
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
