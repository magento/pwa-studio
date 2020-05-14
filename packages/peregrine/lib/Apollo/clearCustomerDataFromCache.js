import { deleteCacheEntry } from './deleteCacheEntry';

/**
 * Deletes all references to Customer from the apollo cache including entries that
 * start with "$" which were automatically created by Apollo InMemoryCache.
 *
 * @param {ApolloClient} client
 */
export const clearCustomerDataFromCache = async client => {
    await deleteCacheEntry(client, key => key.match(/^\$?Customer/));
};
