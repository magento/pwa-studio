import { createElement } from 'react';
import ReactDOM from 'react-dom';
import bootstrap from '@magento/peregrine';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import appReducer from 'src/reducers/app';
import directoryReducer from 'src/reducers/directory';
import './index.css';

const { Provider, store } = bootstrap({
    apiBase: new URL('/graphql', location.origin).toString(),
    __tmp_webpack_public_path__: __webpack_public_path__
});

store.addReducer('app', appReducer);
store.addReducer('directory', directoryReducer);

const apolloClient = new ApolloClient();

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
