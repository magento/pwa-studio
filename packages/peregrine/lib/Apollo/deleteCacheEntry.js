/**
 * Deletes specific entry/entries from the apollo cache.
 *
 * @param {ApolloClient} client from useApolloClient, etc.
 * @param {Function} predicate a matching function
 */
export const deleteCacheEntry = (client, predicate) => {
    Object.keys(client.cache.data.data).forEach(key => {
        if (predicate(key)) {
            client.cache.data.delete(key);
        }
    });
};
