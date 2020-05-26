import { deleteCacheEntry } from './deleteCacheEntry';

/**
 * Deletes all references to Customer from the apollo cache including entries
 * that start with "$" which were automatically created by Apollo InMemoryCache.
 * By coincidence this rule additionally clears CustomerAddress entries, but
 * we'll need to keep this in mind by adding additional patterns as MyAccount
 * features are completed.
 *
 * @param {ApolloClient} client
 */
export const clearCustomerDataFromCache = async client => {
    await deleteCacheEntry(client, key => key.match(/^\$?Customer/));
};
