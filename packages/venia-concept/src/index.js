import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import en from '@magento/venia-ui/lib/i18n/en_US.json';
import fr from '@magento/venia-ui/lib/i18n/fr_FR.json';

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

const messages = {
    'en-US': en,
    'fr-FR': fr
};
const language = process.env.LOCALE;

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
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    if (networkError) console.log(`[Network error]: ${networkError}`);
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

const onIntlError = error => {
    if (error.code === 'MISSING_TRANSLATION') {
        console.warn('Missing translation', error.message);
        return;
    }
    throw error;
};

ReactDOM.render(
    <Adapter apiBase={apiBase} apollo={{ link: apolloLink }} store={store}>
        <AppContextProvider>
            <IntlProvider
                locale={language}
                key={language}
                messages={messages[language]}
                onError={onIntlError}
            >
                <App />
            </IntlProvider>
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
