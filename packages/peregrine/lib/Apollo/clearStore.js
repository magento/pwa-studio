/**
 * Wipes the apollo cache in memory and persistence.
 *
 * @param {ApolloClient} client client with persistor objec
 */
export const clearStore = async (client, persistor) => {
    // Pause automatic persistence.
    persistor.pause();

    // Delete everything in the storage provider.
    await persistor.purge();

    // Wipe the apollo store. Do not replay queries.
    await client.clearStore();

    // Resume automatic persistence.
    persistor.resume();
};
