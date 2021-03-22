import { deleteCacheEntry } from './deleteCacheEntry';

/**
 * Deletes references to Customer Wishlists from the apollo cache including *WishlistItem entries
 *
 * @param {ApolloClient} client
 */
export const clearWishlistDataFromCache = async client => {
    await deleteCacheEntry(client, key =>
        key.match(/^\$?[a-zA-Z]+WishlistItem/)
    );
    await deleteCacheEntry(client, key => key.match(/^\$?Wishlist/));
};
