import { useEffect, useState } from 'react';
import { ApolloClient } from 'apollo-client';
import { CachePersistor } from 'apollo-cache-persist';

/**
 * Synchronously initializes an apollo client with provided props and a
 * persisted cache.
 *
 * @param {String} props.apiBase base path for url
 * @param {Object} props.cache an apollo cache
 * @param {Object} props.client an apollo client instance
 * @param {Object} props.link
 * @param {Object} props.resolvers
 *
 * @returns {ApolloClient} an initialized apollo client
 */
export const useCreateClient = props => {
    const { apiBase, cache, client: propsClient, link, resolvers } = props;

    const [apolloClient, setApolloClient] = useState(null);

    useEffect(() => {
        let client;
        if (propsClient) {
            client = propsClient;
        } else {
            client = new ApolloClient({ cache, link, resolvers });
            client.apiBase = apiBase;
        }

        const initData = {
            // Any initial cache state can go here!
        };

        cache.writeData({ data: initData });

        const persistor = new CachePersistor({
            cache,
            storage: window.localStorage,
            debug: process.env.NODE_ENV === 'development'
        });

        client.persistor = persistor;
        client.onResetStore(async () => cache.writeData({ data: initData }));

        setApolloClient(client);

        return () => {};
    }, [apiBase, cache, link, propsClient, resolvers]);

    return apolloClient;
};
