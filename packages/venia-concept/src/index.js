import React from 'react';
import ReactDOM from 'react-dom';
import bootstrap from '@magento/peregrine';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getUserDetails } from 'src/actions/user';
import { Util } from '@magento/peregrine';

import reducer from 'src/reducers/app';
import userReducer from 'src/reducers/user';
import cartReducer from 'src/reducers/cart';
import checkoutReducer from 'src/reducers/checkout';
import directoryReducer from 'src/reducers/directory';
import checkoutReceipt from 'src/components/Checkout/Receipt/reducer';

import './index.css';

const urlBase = new URL('/graphql', location.origin).toString();

const { BrowserPersistence } = Util;

const { Provider, store } = bootstrap({
    apiBase: urlBase,
    __tmp_webpack_public_path__: __webpack_public_path__
});

store.addReducer('app', reducer);
store.addReducer('user', userReducer);
store.addReducer('cart', cartReducer);
store.addReducer('checkout', checkoutReducer);
store.addReducer('directory', directoryReducer);
store.addReducer('checkoutReceipt', checkoutReceipt);

store.dispatch(getUserDetails());

const httpLink = createHttpLink({
    uri: urlBase,
    __tmp_webpack_public_path__: __webpack_public_path__
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const storage = new BrowserPersistence();
    // TODO: Get correct token expire time from API
    const token = storage.getItem('signin_token');

    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

ReactDOM.render(
    <ApolloProvider client={apolloClient}>
        <Provider />
    </ApolloProvider>,
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
