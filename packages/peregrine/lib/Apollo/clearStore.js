/**
 * Wipes the apollo cache in memory and persistence.
 *
 * According to Apollo's docs you should only have to call client.clearStore
 * but if you use a persistence layer such as apollo-cache-persist you MUST
 * pause and purge the persistor's buffer _before_ calling clear store otherwise
 * the data is immediately replayed into the client store from the persistor.
 *
 * See: https://github.com/apollographql/apollo-cache-persist/issues/34#issuecomment-371177206
 *
 * @param {ApolloClient} client apollo client instance
 * @param {PersistorInstance} persistor persistor instance
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
