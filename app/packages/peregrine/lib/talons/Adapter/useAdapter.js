import { ApolloLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloClient } from '@apollo/client/core';
import { CachePersistor } from 'apollo-cache-persist';
import { useCallback, useEffect, useMemo, useState } from 'react';

import attachClient from '@magento/peregrine/lib/Apollo/attachClientToStore';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import { CACHE_PERSIST_PREFIX } from '@magento/peregrine/lib/Apollo/constants';
import getLinks from '@magento/peregrine/lib/Apollo/links';
import typePolicies from '@magento/peregrine/lib/Apollo/policies';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const isServer = !globalThis.document;
const storage = new BrowserPersistence();
const urlHasStoreCode = process.env.USE_STORE_CODE_IN_URL === 'true';

export const useAdapter = props => {
    const { apiUrl, configureLinks, origin, store, styles } = props;
    const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;
    const basename = urlHasStoreCode ? `/${storeCode}` : null;
    const [initialized, setInitialized] = useState(false);

    const apiBase = useMemo(
        () => apiUrl || new URL('/graphql', origin).toString(),
        [apiUrl, origin]
    );

    const apolloLink = useMemo(() => {
        let links = getLinks(apiBase);

        if (configureLinks) {
            links = configureLinks(links, apiBase);
        }

        return ApolloLink.from(Array.from(links.values()));
    }, [apiBase, configureLinks]);

    const createApolloClient = useCallback((cache, link) => {
        return new ApolloClient({
            cache,
            link,
            ssrMode: isServer
        });
    }, []);

    const createCachePersistor = useCallback((storeCode, cache) => {
        return isServer
            ? null
            : new CachePersistor({
                  key: `${CACHE_PERSIST_PREFIX}-${storeCode}`,
                  cache,
                  storage: globalThis.localStorage,
                  debug: process.env.NODE_ENV === 'development'
              });
    }, []);

    const clearCacheData = useCallback(
        async (client, cacheType) => {
            const storeCode = storage.getItem('store_view_code') || 'default';

            // Clear current store
            if (cacheType === 'cart') {
                await clearCartDataFromCache(client);
            } else if (cacheType === 'customer') {
                await clearCustomerDataFromCache(client);
            }

            // Clear other stores
            for (const store of AVAILABLE_STORE_VIEWS) {
                if (store.store_code !== storeCode) {
                    // Get saved data directly from local storage
                    const existingStorePersistor = globalThis.localStorage.getItem(
                        `${CACHE_PERSIST_PREFIX}-${store.store_code}`
                    );

                    // Make sure we have data available
                    if (
                        existingStorePersistor &&
                        Object.keys(existingStorePersistor).length > 0
                    ) {
                        const storeCache = new InMemoryCache();

                        // Restore available data
                        storeCache.restore(JSON.parse(existingStorePersistor));

                        const storeClient = createApolloClient(
                            storeCache,
                            apolloLink
                        );

                        storeClient.persistor = isServer
                            ? null
                            : createCachePersistor(
                                  store.store_code,
                                  storeCache
                              );

                        // Clear other store
                        if (cacheType === 'cart') {
                            await clearCartDataFromCache(storeClient);
                        } else if (cacheType === 'customer') {
                            await clearCustomerDataFromCache(storeClient);
                        }
                    }
                }
            }
        },
        [apolloLink, createApolloClient, createCachePersistor]
    );

    const apolloClient = useMemo(() => {
        const storeCode = storage.getItem('store_view_code') || 'default';
        const client = createApolloClient(preInstantiatedCache, apolloLink);
        const persistor = isServer
            ? null
            : createCachePersistor(storeCode, preInstantiatedCache);

        client.apiBase = apiBase;
        client.persistor = persistor;
        client.clearCacheData = clearCacheData;

        return client;
    }, [
        apiBase,
        apolloLink,
        clearCacheData,
        createApolloClient,
        createCachePersistor
    ]);

    const getUserConfirmation = useCallback(async (message, callback) => {
        if (typeof globalThis.handleRouteChangeConfirmation === 'function') {
            return globalThis.handleRouteChangeConfirmation(message, callback);
        }

        return callback(globalThis.confirm(message));
    }, []);

    const apolloProps = { client: apolloClient };
    const reduxProps = { store };
    const routerProps = { basename, getUserConfirmation };
    const styleProps = { initialState: styles };

    // perform blocking async work here
    useEffect(() => {
        if (initialized) return;

        // immediately invoke this async function
        (async () => {
            // restore persisted data to the Apollo cache
            await apolloClient.persistor.restore();

            // attach the Apollo client to the Redux store
            await attachClient(apolloClient);

            // mark this routine as complete
            setInitialized(true);
        })();
    }, [apolloClient, initialized]);

    return {
        apolloProps,
        initialized,
        reduxProps,
        routerProps,
        styleProps,
        urlHasStoreCode
    };
};

/**
 * To improve initial load time, create an apollo cache object as soon as
 * this module is executed, since it doesn't depend on any component props.
 * The tradeoff is that we may be creating an instance we don't end up needing.
 */
const preInstantiatedCache = new InMemoryCache({
    // POSSIBLE_TYPES is injected into the bundle by webpack at build time.
    possibleTypes: POSSIBLE_TYPES,
    typePolicies
});
