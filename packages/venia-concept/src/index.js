import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import getWithPath from 'lodash.get';

import { RetryLink } from 'apollo-link-retry';
import MutationQueueLink from '@adobe/apollo-link-mutation-queue';

import { Util } from '@magento/peregrine';
import { Adapter } from '@magento/venia-drivers';
import store from './store';
import app from '@magento/peregrine/lib/store/actions/app';
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';

import { registerSW } from './registerSW';

const { BrowserPersistence } = Util;
const apiBase = new URL('/graphql', location.origin).toString();

/**
 * The Venia adapter provides basic context objects: a router, a store, a
 * GraphQL client, and some common functions.
 */

// The Venia adapter is not opinionated about auth.
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

// https://www.apollographql.com/docs/link/links/error/
const errorLink = onError(({ graphQLErrors, networkError, response }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    if (networkError) console.log(`[Network error]: ${networkError}`);

    const { data, errors } = response;

    errors.forEach(({ message, path }, index) => {
        // It's within the GraphQL spec to receive data and errors, where errors are merely informational and not
        // intended to block. Almost all existing components were not built with this in mind, so we build special
        // handling of this error message so we can deal with it at the time we deem appropriate.
        if (message === 'Some of the products are out of stock.') {
            const pathToCartItems = path.slice(0, -1);
            const cartItems = getWithPath(data, pathToCartItems);

            // Until MC-36092 is resolved, we need to guard against a null product being returned as well.
            if (cartItems[0] === null) {
                cartItems.splice(0, 1);
            }

            // Suppress entirely if this is our only error, we don't want to cause operations to throw.
            if (response.errors.length === 1) {
                response.errors = undefined;
            } else {
                response.errors[index] = undefined;
            }
        }
    });
});

// @see https://www.apollographql.com/docs/link/composition/.
const apolloLink = ApolloLink.from([
    new MutationQueueLink(),
    new RetryLink({
        delay: {
            initial: 300,
            max: Infinity,
            jitter: true
        },
        attempts: {
            max: 5,
            retryIf: error => error && navigator.onLine
        }
    }),
    authLink,
    errorLink,
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
