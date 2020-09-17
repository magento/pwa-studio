import React, { useEffect, useState } from 'react';
import { func, shape, string } from 'prop-types';
import { CachePersistor } from 'apollo-cache-persist';
import { ApolloProvider, createHttpLink } from '@apollo/client';
import { ApolloClient } from '@apollo/client/core';
import { InMemoryCache } from '@apollo/client/cache';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import resolvers from '../resolvers';
import typePolicies from '../policies';
import { shrinkGETQuery } from '../util/shrinkGETQuery';

/**
 * To improve initial load time, create an apollo cache object as soon as
 * this module is executed, since it doesn't depend on any component props.
 * The tradeoff is that we may be creating an instance we don't end up needing.
 */
const preInstantiatedCache = new InMemoryCache({
    typePolicies,
    // POSSIBLE_TYPES is injected into the bundle by webpack at build time.
    possibleTypes: POSSIBLE_TYPES
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
 *
 * @param {String} props.apiBase base path for url
 * @param {Object} props.apollo.cache an apollo cache instance
 * @param {Object} props.apollo.client an apollo client instance
 * @param {Object} props.apollo.link an apollo link instance
 * @param {Object} props.store redux store to provide
 */
const VeniaAdapter = props => {
    const { apiBase, apollo = {}, children, store } = props;

    const cache = apollo.cache || preInstantiatedCache;
    const link = apollo.link || VeniaAdapter.apolloLink(apiBase);

    const persistor = new CachePersistor({
        cache,
        storage: window.localStorage,
        debug: process.env.NODE_ENV === 'development'
    });

    let apolloClient;
    if (apollo.client) {
        apolloClient = apollo.client;
    } else {
        apolloClient = new ApolloClient({
            cache,
            link,
            resolvers
        });
        apolloClient.apiBase = apiBase;
    }

    apolloClient.persistor = persistor;

    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        async function initialize() {
            // On load, restore the persisted data to the apollo cache and then
            // allow rendering. You can do other async blocking stuff here.
            if (persistor) {
                await persistor.restore();
            }
            setInitialized(true);
        }
        if (!initialized) {
            initialize();
        }
    }, [initialized, persistor]);

    if (!initialized) {
        // TODO: Replace with app skeleton. See PWA-547.
        return null;
    }

    return (
        <ApolloProvider client={apolloClient}>
            <ReduxProvider store={store}>
                <BrowserRouter>{children}</BrowserRouter>
            </ReduxProvider>
        </ApolloProvider>
    );
};

/**
 * We attach this Link as a static method on VeniaAdapter because
 * other modules in the codebase need access to it.
 */
VeniaAdapter.apolloLink = apiBase => {
    // Intercept and shrink URLs from GET queries. Using
    // GET makes it possible to use edge caching in Magento
    // Cloud, but risks exceeding URL limits with default usage
    // of Apollo's http link. `shrinkGETQuery` encodes the URL
    // in a more efficient way.
    const customFetchToShrinkQuery = (uri, options) => {
        let url = uri;
        if (options.method === 'GET') {
            url = shrinkGETQuery(uri);
        }
        return fetch(url, options);
    };

    return createHttpLink({
        uri: apiBase,
        fetch: customFetchToShrinkQuery,
        // Warning: useGETForQueries risks exceeding URL length limits. These limits
        // in practice are typically set at or behind where TLS terminates. For Magento
        // Cloud and Fastly, 8kb is the maximum by default
        // https://docs.fastly.com/en/guides/resource-limits#request-and-response-limits
        useGETForQueries: true
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
