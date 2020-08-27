import { deleteCacheEntry } from './deleteCacheEntry';

/**
 * Deletes all references to Cart from the apollo cache including entries that
 * start with "$" which were automatically created by Apollo InMemoryCache.
 *
 * @param {ApolloClient} client
 */
export const clearCartDataFromCache = async client => {
    await deleteCacheEntry(client, key => key.match(/^\$?Cart/));

    // Gift Cards are cached by code so we must delete these too.
    await deleteCacheEntry(client, key => key.match(/^\$?AppliedGiftCard/));
};
