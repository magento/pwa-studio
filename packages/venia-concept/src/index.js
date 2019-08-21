import React from 'react';
import ReactDOM from 'react-dom';
import { setContext } from 'apollo-link-context';
import { Util } from '@magento/peregrine';
import { Adapter } from '@magento/venia-drivers';
import store from './store';
import app from '@magento/venia-ui/lib/actions/app';
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
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
        <AppContextProvider>
            <App />
        </AppContextProvider>
    </Adapter>,
    document.getElementById('root')
);

if (
    process.env.NODE_ENV === 'production' ||
    process.env.DEV_SERVER_SERVICE_WORKER_ENABLED
) {
    window.addEventListener('load', () =>
        navigator.serviceWorker
            .register('/sw.js')
            .then(registration => {
                console.log('Service worker registered: ', registration);
            })
            .catch(error => {
                console.log('Service worker registration failed: ', error);
            })
    );
}

window.addEventListener('online', () => {
    store.dispatch(app.setOnline());
});
window.addEventListener('offline', () => {
    store.dispatch(app.setOffline());
});
