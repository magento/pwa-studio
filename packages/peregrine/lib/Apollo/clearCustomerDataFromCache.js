/**
 * Deletes all references to Customer from the apollo cache.
 * Related queries that have reference to the customer are also deleted
 * through the cascade. Note, however, that all secondary references must
 * be deleted in order for garbage collection to do its job.
 *
 * @param {ApolloClient} client
 */
export const clearCustomerDataFromCache = async client => {
    // Cached data
    client.cache.evict({ id: 'Customer' });
    // Cached ROOT_QUERY
    client.cache.evict({ fieldName: 'customer' });
    client.cache.evict({ fieldName: 'customerWishlistProducts' });
    client.cache.evict({ fieldName: 'dynamicBlocks' });

    client.cache.gc();

    if (client.persistor) {
        await client.persistor.persist();
    }
};
