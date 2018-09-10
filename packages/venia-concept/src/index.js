import { createElement } from 'react';
import ReactDOM from 'react-dom';
import bootstrap from '@magento/peregrine';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

import reducer from 'src/reducers/app';
import userReducer from 'src/reducers/app';
import './index.css';

const urlBase = new URL('/graphql', location.origin).toString();

const { Provider, store } = bootstrap({
    apiBase: urlBase,
    __tmp_webpack_public_path__: __webpack_public_path__
});

store.addReducer('app', reducer);
store.addReducer('user', userReducer);

const httpLink = createHttpLink({
    uri: urlBase,
    __tmp_webpack_public_path__: __webpack_public_path__,
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('login_token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
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

export { store };
