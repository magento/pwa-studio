import React from 'react';
import { render } from 'react-dom';

import { ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import getWithPath from 'lodash.get';
import setWithPath from 'lodash.set';

import MutationQueueLink from '@adobe/apollo-link-mutation-queue';

import { Util } from '@magento/peregrine';
import { Adapter } from '@magento/venia-ui/lib/drivers';
import store from './store';
import app from '@magento/peregrine/lib/store/actions/app';
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
import StyleContextProvider from '@magento/peregrine/lib/context/style';

import { registerSW } from './registerSW';

const isServer = !globalThis.document;
const { BrowserPersistence } = Util;
const origin = 'https://magento-venia-concept-e1r4b.local.pwadev:8048';
const apiBase = new URL('/graphql', origin).toString();

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

    if (response) {
        const { data, errors } = response;
        let pathToCartItems;

        // It's within the GraphQL spec to receive data and errors, where errors are merely informational and not
        // intended to block. Almost all existing components were not built with this in mind, so we build special
        // handling of this error message so we can deal with it at the time we deem appropriate.
        errors.forEach(({ message, path }, index) => {
            if (
                message === 'Some of the products are out of stock.' ||
                message === 'There are no source items with the in stock status'
            ) {
                if (!pathToCartItems) {
                    pathToCartItems = path.slice(0, -1);
                }

                // Set the error to null to be cleaned up later
                response.errors[index] = null;
            }
        });

        // indicator that we have some cleanup to perform on the response
        if (pathToCartItems) {
            const cartItems = getWithPath(data, pathToCartItems);
            const filteredCartItems = cartItems.filter(
                cartItem => cartItem !== null
            );
            setWithPath(data, pathToCartItems, filteredCartItems);

            const filteredErrors = response.errors.filter(
                error => error !== null
            );
            // If all errors were stock related and set to null, reset the error response so it doesn't throw
            response.errors = filteredErrors.length
                ? filteredErrors
                : undefined;
        }
    }
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
            retryIf: error => error && !isServer && navigator.onLine
        }
    }),
    authLink,
    Adapter.storeLink,
    errorLink,
    // An apollo-link-http Link
    Adapter.apolloLink(apiBase)
]);

// on the server, imported styles will be added to this set and rendered in bulk
const styleSet = new Set();

const tree = (
    <Adapter apiBase={apiBase} apollo={{ link: apolloLink }} store={store}>
        <StyleContextProvider initialState={styleSet}>
            <AppContextProvider>
                <App />
            </AppContextProvider>
        </StyleContextProvider>
    </Adapter>
);

if (isServer) {
    // TODO: ensure this actually renders correctly
    import('react-dom/server').then(({ default: ReactDOMServer }) => {
        console.log(ReactDOMServer.renderToString(tree));
    });
} else {
    render(tree, document.getElementById('root'));
    registerSW();

    globalThis.addEventListener('online', () => {
        store.dispatch(app.setOnline());
    });
    globalThis.addEventListener('offline', () => {
        store.dispatch(app.setOffline());
    });
}
