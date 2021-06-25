import { CACHE_PERSIST_PREFIX } from '@magento/peregrine/lib/Apollo/constants';

/**
 * Deletes specific entry/entries from the apollo cache and then tries to
 * persist the deletions.
 *
 * @param {ApolloClient} client apollo client instance
 * @param {Function} predicate a matching function
 */
export const deleteCacheEntry = async (client, predicate) => {
    await deleteActiveCacheEntry(client, predicate);
    await deleteInactiveCachesEntry(client, predicate);
};

const deleteActiveCacheEntry = async (client, predicate) => {
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

    // Remove from the active cache.
    Object.keys(client.cache.data.data).forEach(key => {
        if (predicate(key)) {
            client.cache.data.delete(key);
        }
    });

    // Remove from ROOT_QUERY cache.
    if (client.cache.data.data.ROOT_QUERY) {
        Object.keys(client.cache.data.data.ROOT_QUERY).forEach(key => {
            if (predicate(key)) {
                client.cache.data.delete('ROOT_QUERY', key);
            }
        });
    }

    // Immediately persist the cache changes to the active cache storage.
    if (client.persistor) {
        await client.persistor.persist();
    }
};

const deleteInactiveCachesEntry = async (client, predicate) => {
    if (!client || !client.persistor || !globalThis.localStorage) return;

    const activeApolloCacheLocalStorageKey =
        client.persistor.persistor.storage.key;

    const isAnInactiveApolloCache = ([key]) => {
        return (
            key.startsWith(CACHE_PERSIST_PREFIX) &&
            key !== activeApolloCacheLocalStorageKey
        );
    };

    const { localStorage } = globalThis;

    Object.entries(localStorage)
        .filter(isAnInactiveApolloCache)
        .forEach(([inactiveCacheKey, inactiveCacheValue]) => {
            const inactiveApolloCache = JSON.parse(inactiveCacheValue);

            Object.keys(inactiveApolloCache).forEach(key => {
                if (predicate(key)) {
                    delete inactiveApolloCache[key];
                }
            });

            // We're done deleting keys that match the predicate,
            // but we've only mutated the object in memory.
            // Write the updated inactive cache back out to localStorage.
            localStorage.setItem(
                inactiveCacheKey,
                JSON.stringify(inactiveApolloCache)
            );
        });
};
