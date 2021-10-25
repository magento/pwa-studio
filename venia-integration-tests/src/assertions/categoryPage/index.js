import {
    categoryPageSelectedWishlistButton,
    categoryContentTitle,
    productsGalleryItemName,
    productsNoProductsFound,
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
