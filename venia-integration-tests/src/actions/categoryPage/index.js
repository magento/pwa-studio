import {
    categoryPageAddToWishListButton,
    createWishlistButton,
    wishlistNameField,
    createWishlistConfirmButton,
    categoryTreeBranchTarget,
    categoryTreeLeafTarget,
    megaMenuMega,
    megaMenuMegaMenuItem,
    megaMenuMegaMenuItemLink,
    megaMenuSubmenuColumnLink
} from '../../fields/categoryPage';

/**
 * Utility function to add product to wishlist from category page
 */
export const addProductToWishlistFromCategoryPage = productToAdd => {
    // add product to wishlist
    cy.contains(productToAdd)
        .siblings()
        .find(categoryPageAddToWishListButton)
        .click();
};

/**
 * Utility function to create wishlist
 *
 * @param {String} wishlistName wishlist name
 */
export const createWishlistViaDialog = wishlistName => {
    // click on Create a List link
    cy.get(createWishlistButton).click();

    // enter wishlist name
    cy.get(wishlistNameField).type(wishlistName);

    // Create wishlist
    cy.get(createWishlistConfirmButton).click();
};

/**
 * Select a Category from Category Tree
 *
 * @param {String} categoryName category name
 */
export const selectCategoryFromTree = categoryName => {
    cy.get(`${categoryTreeBranchTarget}, ${categoryTreeLeafTarget}`)
        .filter(`:contains("${categoryName}")`)
        .click();
};

/**
 * Hover a Category from Mega Menu
 *
 * @param {String} categoryName category name
 */
export const hoverCategoryFromMegaMenu = categoryName => {
    cy.get(megaMenuMega).trigger('focusin');
    cy.get(megaMenuMegaMenuItem)
        .filter(`:contains("${categoryName}")`)
        .trigger('keydown', { key: 'ArrowDown' });
};

/**
 * Select a Category from Mega Menu
 *
 * @param {String} categoryName category name
 */
export const selectCategoryFromMegaMenu = categoryName => {
    cy.get(`${megaMenuMegaMenuItemLink}, ${megaMenuSubmenuColumnLink}`)
        .filter(`:contains("${categoryName}")`)
        .click({ force: true });
};
