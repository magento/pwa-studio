/**
 * Deletes specific entry/entries from the apollo cache and then tries to
 * persist the deletions.
 *
 * @param {ApolloClient} client apollo client instance
 * @param {Function} predicate a matching function
 */
export const deleteCacheEntry = async (client, predicate) => {
    // If there is no client or cache then just back out since it doesn't matter :D
    if (
        !client ||
        !client.cache ||
        !client.cache.data ||
        !client.cache.data.data
    ) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(
                'Apollo Cache entry deletion attempted without client or cache.'
            );
        }
        return;
    }

    Object.keys(client.cache.data.data).forEach(key => {
        if (predicate(key)) {
            client.cache.data.delete(key);
        }
    });

    // Immediately persist the cache changes.
    if (client.persistor) {
        await client.persistor.persist();
    }
};
