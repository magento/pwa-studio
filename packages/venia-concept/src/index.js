import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from '@magento/peregrine';

import store from 'src/store';
import AppShell from 'src/components/AppShell';
import ensureDirURI from 'src/util/ensureDirUri';
import './index.css';

const apolloClient = new ApolloClient();

const runtimeConfig = {
    apiBase: new URL('/graphql', location.origin).toString(),
    __tmp_webpack_public_path__: ensureDirURI(__webpack_public_path__)
};

ReactDOM.render(
    <ApolloProvider client={apolloClient}>
        <ReduxProvider store={store}>
            <Router config={runtimeConfig}>
                <AppShell />
            </Router>
        </ReduxProvider>
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
