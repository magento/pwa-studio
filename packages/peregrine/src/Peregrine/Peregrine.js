import { createElement } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import createStore from '../store';

/**
 *
 * @param {string} apiBase Absolute URL pointing to the GraphQL endpoint
 * @param {string} __tmp_webpack_public_path__ Temporary hack. Expects the `__webpack_public_path__` value
 * @returns {{ store: Store, Provider: () => JSX.Element }}
 */
export default function bootstrap({ customRouter }) {
    // Remove deprecation warning after 2 version bumps
    if (process.env.NODE_ENV !== 'production' && this instanceof bootstrap) {
        throw new Error(
            'The API for Peregrine has changed. ' +
                'Please see the Release Notes on Github ' +
                'for instructions to update your application'
        );
    }

    const store = createStore();

    const Provider = () => (
        createElement(ReduxProvider, {store: store}, customRouter)
    );

    return { store, Provider };
}

