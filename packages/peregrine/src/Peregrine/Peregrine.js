import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import createStore from '../store';
import MagentoRouter from '../Router';

/**
 *
 * @param {string} apiBase Absolute URL pointing to the GraphQL endpoint
 * @returns {{ store: Store, Provider: () => JSX.Element }}
 */
export default function bootstrap({ apiBase }) {
    // Remove deprecation warning after 2 version bumps
    if (process.env.NODE_ENV !== 'production' && this instanceof bootstrap) {
        throw new Error(
            'The API for Peregrine has changed. ' +
                'Please see the Release Notes on Github ' +
                'for instructions to update your application'
        );
    }

    const store = createStore();
    const routerProps = {
        apiBase
    };
    const Provider = () => (
        <ReduxProvider store={store}>
            <MagentoRouter {...routerProps} />
        </ReduxProvider>
    );

    return { store, Provider };
}
