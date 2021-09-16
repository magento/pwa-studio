/**
 * Deletes all references to Cart from the apollo cache
 *
 * @param {ApolloClient} client
 */
export const clearCartDataFromCache = async client => {
    // Cached data
    client.cache.evict({ id: 'Cart' });
    client.cache.evict({
        id: 'ROOT_MUTATION',
        fieldName: 'placeOrder'
    });
    // Cached ROOT_QUERY
    client.cache.evict({ fieldName: 'cart' });
    client.cache.evict({ fieldName: 'customerCart' });

    client.cache.gc();

    if (client.persistor) {
        await client.persistor.persist();
    }
};
