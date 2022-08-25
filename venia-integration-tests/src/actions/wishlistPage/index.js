import {
    createWishlistButton,
    wishlistNameField,
    createWishlistConfirmButton,
    wishlistItemRemoveButton,
    wishlistRoot,
    wishlistHeadingButtonsContainer
} from '../../fields/wishlist';

/**
 * Utility function to create wishlist
 *
 * @param {String} wishlistName wishlist name
 */
export const createWishlist = wishlistName => {
    // click on Create a List link
    cy.get(createWishlistButton).click();

    // enter wishlist name
    cy.get(wishlistNameField).type(wishlistName);

    // Create wishlist
    cy.get(createWishlistConfirmButton).click();
};

/**
 * Utility function to remove given item from a single wishlist.
 * The utility assumes that the action is called from the wishlist page.
 *
 * Note: Only useful if MOS or AC with mutiple wishlists disabled
 *
 * @param {String} productName name of the product to remove
 */
export const removeProductFromSingleWishlist = productName => {
    cy.contains('div', productName)
        .children(wishlistItemRemoveButton)
        .click();
};

/**
 * Utility function to expand all collapsed wishlists in the wishlist page.
 */
export const expandCollapsedWishlists = () => {
    const wishlists = cy
        .get(wishlistRoot)
        .nextAll()
        .children();

    wishlists
        .find(wishlistHeadingButtonsContainer)
        .children()
        .filter('button')
        .click({ multiple: true });
};
