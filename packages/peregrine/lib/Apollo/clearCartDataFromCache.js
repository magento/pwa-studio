import { deleteCacheEntry } from './deleteCacheEntry';

/**
 * Deletes all references to Cart from the apollo cache including entries that
 * start with "$" which were automatically created by Apollo InMemoryCache.
 *
 * @param {ApolloClient} client
 */
export const clearCartDataFromCache = async client => {
    await deleteCacheEntry(client, key => key.match(/^\$?Cart/));

    // Any cart subtypes that have key fields must be manually cleared.
    // TODO: we may be able to use cache.evict here instead.
    await deleteCacheEntry(client, key => key.match(/^\$?AppliedGiftCard/));
    await deleteCacheEntry(client, key => key.match(/^\$?ShippingCartAddress/));
    await deleteCacheEntry(client, key =>
        key.match(/^\$?AvailableShippingMethod/)
    );
};
