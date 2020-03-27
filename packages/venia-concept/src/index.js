import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { RetryLink } from 'apollo-link-retry';
import MutationQueueLink from '@adobe/apollo-link-mutation-queue';

import { Util } from '@magento/peregrine';
import { Adapter } from '@magento/venia-drivers';
import store from './store';
import app from '@magento/peregrine/lib/store/actions/app';
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';

import { registerSW } from './registerSW';
import './index.css';
import { initi18n } from './i18n'; // Absolunet

const { BrowserPersistence } = Util;
const apiBase = new URL('/graphql', location.origin).toString();
const storage = new BrowserPersistence();

/* Absolunet Custom Code */
let storeView = storage.getItem('store_view');

if (storeView === undefined) {
    storage.setItem('store_view', process.env.DEFAULT_LOCALE);
    storeView = storage.getItem('store_view');
}

/* End Absolunet Custom Code */
initi18n(); // Absolunet

/**
 * The Venia adapter provides basic context objects: a router, a store, a
 * GraphQL client, and some common functions.
 */
// The Venia adapter is not opinionated about auth.
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists.
    const token = storage.getItem('signin_token');

    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            STORE: storeView, // Absolunet
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

// @see https://www.apollographql.com/docs/link/composition/.
const apolloLink = ApolloLink.from([
    new MutationQueueLink(),
    // by default, RetryLink will retry an operation five (5) times.
    new RetryLink(),
    authLink,
    // An apollo-link-http Link
    Adapter.apolloLink(apiBase)
]);

ReactDOM.render(
    <Adapter apiBase={apiBase} apollo={{ link: apolloLink }} store={store}>
        <AppContextProvider>
            <App />
        </AppContextProvider>
    </Adapter>,
    document.getElementById('root')
);

registerSW();

window.addEventListener('online', () => {
    store.dispatch(app.setOnline());
});
window.addEventListener('offline', () => {
    store.dispatch(app.setOffline());
});

if (module.hot) {
    // When any of the dependencies to this entry file change we should hot reload.
    module.hot.accept();
}
