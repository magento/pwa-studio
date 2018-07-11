import { createElement } from 'react';
import ReactDOM from 'react-dom';
import bootstrap from '@magento/peregrine';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import reducer from 'src/store/reducers/app';
import './index.css';

const { Provider, store } = bootstrap({
    apiBase: new URL('/graphql', location.origin).toString(),
    __tmp_webpack_public_path__: __webpack_public_path__
});

store.addReducer('app', reducer);

const apolloClient = new ApolloClient();

const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

ReactDOM.render(
    <ApolloProvider client={apolloClient}>
        <Provider />
    </ApolloProvider>,
    root
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
