import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { RetryLink } from 'apollo-link-retry';
import { Util } from '@magento/peregrine';
import { Adapter } from '@magento/venia-drivers';
import store from './store';
import app from '@magento/peregrine/lib/store/actions/app';
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
import './index.css';

const { BrowserPersistence } = Util;
const apiBase = new URL('/graphqlFAKE', location.origin).toString();

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

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
  
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

// @see https://www.apollographql.com/docs/link/composition/.
const apolloLink = ApolloLink.from([
    // by default, RetryLink will retry an operation five (5) times.
    new RetryLink(),
    authLink,
    errorLink,
    // An apollo-link-http Link
    Adapter.apolloLink(apiBase)
]);

ReactDOM.render(
    <Adapter
        apiBase={apiBase}
        apollo={{ link: apolloLink }}
        store={store}
    >
        <AppContextProvider>
            <App />
        </AppContextProvider>
    </Adapter>,
    document.getElementById('root')
);

window.addEventListener('online', () => {
    store.dispatch(app.setOnline());
});

window.addEventListener('offline', () => {
    store.dispatch(app.setOffline());
});
