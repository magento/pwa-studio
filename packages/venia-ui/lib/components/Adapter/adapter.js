import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, StaticRouter } from 'react-router-dom';

import { useAdapter } from '@magento/peregrine/lib/talons/Adapter/useAdapter';
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
import StoreCodeRoute from '@magento/venia-ui/lib/components/StoreCodeRoute';
import GlobalContextProvider from '@magento/peregrine/lib/context/global';

const Adapter = props => {
    const talonProps = useAdapter(props);
    const {
        apolloProps,
        initialized,
        reduxProps,
        routerProps,
        urlHasStoreCode
    } = talonProps;

    // TODO: Replace with app skeleton. See PWA-547.
    // Do not enable on SSR. Breaks rehydration.
    if (!SSR_ENABLED && !initialized) {
        return null;
    }

    const children = props.children || <App />;
    const storeCodeRouteHandler = urlHasStoreCode ? <StoreCodeRoute /> : null;

    return (
        <ApolloProvider {...apolloProps}>
            <ReduxProvider {...reduxProps}>
                <Router {...routerProps}>
                    <GlobalContextProvider>
                        {storeCodeRouteHandler}
                        <AppContextProvider>{children}</AppContextProvider>
                    </GlobalContextProvider>
                </Router>
            </ReduxProvider>
        </ApolloProvider>
    );
};

Adapter.defaultProps = {
    apollo: {}
};

const Router = IS_SERVER ? StaticRouter : BrowserRouter;

export default Adapter;
