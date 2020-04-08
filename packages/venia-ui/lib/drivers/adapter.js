import React, { useEffect, useState } from 'react';
import { func, shape, string } from 'prop-types';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { CachePersistor } from 'apollo-cache-persist';
import { createHttpLink } from 'apollo-link-http';
import {
    InMemoryCache,
    IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import resolvers from '../resolvers';
import { cacheKeyFromType } from '../util/apolloCache';

/**
 * To improve initial load time, create an apollo cache object as soon as
 * this module is executed, since it doesn't depend on any component props.
 * The tradeoff is that we may be creating an instance we don't end up needing.
 */
const fragmentMatcher = new IntrospectionFragmentMatcher({
    // UNION_AND_INTERFACE_TYPES is injected into the bundle by webpack at build time.
    introspectionQueryResultData: UNION_AND_INTERFACE_TYPES
});

/**
 * The counterpart to `@magento/venia-drivers` is an adapter that provides
 * context objects to the driver dependencies. The default implementation in
 * `@magento/venia-drivers` uses modules such as `react-redux`, which
 * have implicit external dependencies. This adapter provides all of them at
 * once.
 *
 * Consumers of Venia components can either implement a similar adapter and
 * wrap their Venia component trees with it, or they can override `src/drivers`
 * so its components don't depend on context and IO.
 */
const VeniaAdapter = props => {
    const { apiBase, apollo = {}, children, store } = props;

    const [apolloClient, setApolloClient] = useState(undefined);

    useEffect(() => {
        const cache = apollo.cache
            ? apollo.cache
            : new InMemoryCache({
                  dataIdFromObject: cacheKeyFromType,
                  fragmentMatcher
              });

        const link = apollo.link
            ? apollo.link
            : VeniaAdapter.apolloLink(apiBase);

        let client;
        if (apollo.client) {
            client = apollo.client;
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
            debug: true
        });
        client.persistor = persistor;
        client.onResetStore(async () => cache.writeData({ data: initData }));

        setApolloClient(client);

        return () => {};
    }, [apiBase, apollo.cache, apollo.client, apollo.link]);

    if (!apolloClient) {
        // TODO: Render a page skeleton.
        return null;
    } else {
        return (
            <ApolloProvider client={apolloClient}>
                <ReduxProvider store={store}>
                    <BrowserRouter>{children}</BrowserRouter>
                </ReduxProvider>
            </ApolloProvider>
        );
    }
};

/**
 * We attach this Link as a static method on VeniaAdapter because
 * other modules in the codebase need access to it.
 */
VeniaAdapter.apolloLink = apiBase => {
    return createHttpLink({
        uri: apiBase
    });
};

VeniaAdapter.propTypes = {
    apiBase: string.isRequired,
    apollo: shape({
        client: shape({
            query: func.isRequired
        }),
        link: shape({
            request: func.isRequired
        }),
        cache: shape({
            readQuery: func.isRequired
        })
    }),
    store: shape({
        dispatch: func.isRequired,
        getState: func.isRequired,
        subscribe: func.isRequired
    }).isRequired
};

export default VeniaAdapter;
