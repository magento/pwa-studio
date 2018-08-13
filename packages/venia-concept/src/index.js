import { createElement } from 'react';
import ReactDOM from 'react-dom';
import bootstrap from '@magento/peregrine';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import reducer from 'src/reducers/app';
import './index.css';

const { Provider, store } = bootstrap({
    apiBase: new URL('/graphql', location.origin).toString(),
    __tmp_webpack_public_path__: __webpack_public_path__
});

store.addReducer('app', reducer);

const apolloClient = new ApolloClient();

ReactDOM.render(
    <ApolloProvider client={apolloClient}>
        <Provider />
    </ApolloProvider>,
    document.getElementById('root')
);

export { store };
