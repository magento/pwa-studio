import React from 'react';
import ReactDOM from 'react-dom';
import { setContext } from 'apollo-link-context';
import { Util } from '@magento/peregrine';

import { Adapter } from 'src/drivers';
import store from 'src/store';
import app from 'src/actions/app';
import AppWrapper from 'src/components/App/AppWrapper';
import './index.css';

const { BrowserPersistence } = Util;
const apiBase = new URL('/graphql', location.origin).toString();

/**
 * The Venia adapter provides basic context objects: a router, a store, a
 * GraphQL client, and some common functions. It is not opinionated about auth,
 * so we add an auth implementation here and prepend it to the Apollo Link list.
 */
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists.
    const storage = new BrowserPersistence();
    const token = storage.getItem('signin_token');

    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

ReactDOM.render(
    <Adapter
        apiBase={apiBase}
        apollo={{ link: authLink.concat(Adapter.apolloLink(apiBase)) }}
        store={store}
    >
        <AppWrapper />
    </Adapter>,
    document.getElementById('root')
);

if (process.env.SERVICE_WORKER && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(process.env.SERVICE_WORKER)
            .then(registration => {
                console.log('Service worker registered: ', registration);
            })
            .catch(error => {
                console.log('Service worker registration failed: ', error);
            });
    });
}

window.addEventListener('online', () => {
    store.dispatch(app.setOnline());
});
window.addEventListener('offline', () => {
    store.dispatch(app.setOffline());
});
