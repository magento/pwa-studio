import React from 'react';
import { render, hydrate } from 'react-dom';

import store from './store';
import app from '@magento/peregrine/lib/store/actions/app';
import Adapter from '@magento/venia-ui/lib/components/Adapter';
import { preInstantiatedCache } from '@magento/peregrine/lib/talons/Adapter/useAdapter';
import { registerSW } from './registerSW';
import './index.css';
import { ApolloClient } from '@apollo/client';
import { loadableReady } from '@loadable/component';

const configureLinks = links => [...links.values()];

// on the server, components add styles to this set and we render them in bulk
const styles = new Set();

let bootstrap;
let client;
let cache;

if (SSR_ENABLED) {
    bootstrap = render;
} else {
    const state = process.env.ENCODE_APOLLO_STATE
        ? JSON.parse(Base64.decode(globalThis.__APOLLO_STATE__))
        : globalThis.__APOLLO_STATE__;

    cache = preInstantiatedCache.restore(state);

    client = new ApolloClient({
        cache,
        connectToDevTools: process.env.NODE_ENV === 'development'
    });

    client.disableNetworkFetches = true;

    bootstrap = (jsx, container) =>
        loadableReady(() => {
            hydrate(jsx, container, () => {
                client.disableNetworkFetches = false;
            });
        });
}

bootstrap(
    <Adapter
        configureLinks={configureLinks}
        origin={globalThis.location.origin}
        store={store}
        apollo={{ client, cache }}
        styles={styles}
    />,
    document.getElementById('root')
);

registerSW();

globalThis.addEventListener('online', () => {
    store.dispatch(app.setOnline());
});

globalThis.addEventListener('offline', () => {
    store.dispatch(app.setOffline());
});

if (module.hot) {
    // When any of the dependencies to this entry file change we should hot reload.
    module.hot.accept();
}
