import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

import store from './store';
import Adapter from '@magento/venia-ui/lib/components/Adapter';

const configureLinks = links => [...links.values()];

/**
 *
 * @param {IndexServerProps} props
 * @returns
 */
const Index = props => {
    const {
        helmetContext,
        staticContext,
        apollo,
        url,
        origin,
        cookies,
        dom
    } = props;

    return (
        <HelmetProvider context={helmetContext}>
            <Adapter
                configureLinks={configureLinks}
                origin={origin}
                store={store}
                url={url}
                cookies={cookies}
                staticContext={staticContext}
                apollo={apollo}
                dom={dom}
            />
        </HelmetProvider>
    );
};

/**
 * @typedef IndexServerProps
 * @property {string} url
 * @property {string} origin
 * @property {object} cookies
 * @property {object} helmetContext
 * @property {object} staticContext
 * @property {any} cache
 */

export default Index;
