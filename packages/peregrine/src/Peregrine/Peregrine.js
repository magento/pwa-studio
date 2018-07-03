import { createElement } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import initStore from '../store';
import MagentoRouter from '../Router';

/**
 *
 * @param {string} apiBase Absolute URL pointing to the GraphQL endpoint
 * @param {string} __tmp_webpack_public_path__ Temporary hack. Expects the `__webpack_public_path__` value
 * @param reducer the single root reducer resulting from combineReducers() called by the consumer of Peregrine
 * @param middleWare redux middleware added to the store by the consumer of Peregrine
 * @returns {{ store: Store, Provider: () => JSX.Element }}
 */
export default function bootstrap({
    apiBase,
    __tmp_webpack_public_path__,
    reducer,
    middleWare
}) {
    // Remove deprecation warning after 2 version bumps
    if (process.env.NODE_ENV !== 'production' && this instanceof bootstrap) {
        throw new Error(
            'The API for Peregrine has changed. ' +
                'Please see the Release Notes on Github ' +
                'for instructions to update your application'
        );
    }

    const store = initStore(reducer, middleWare);
    const routerProps = {
        apiBase,
        __tmp_webpack_public_path__: ensureDirURI(__tmp_webpack_public_path__)
    };
    const Provider = () => (
        <ReduxProvider store={store}>
            <MagentoRouter {...routerProps} />
        </ReduxProvider>
    );

    return { store, Provider };
}

/**
 * Given a URI, will always return the same URI with a trailing slash
 * @param {string} uri
 */
function ensureDirURI(uri) {
    return uri.endsWith('/') ? uri : uri + '/';
}
