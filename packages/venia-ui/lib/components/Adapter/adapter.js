import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import StyleContextProvider from '@magento/peregrine/lib/context/style';
import { useAdapter } from '@magento/peregrine/lib/talons/Adapter/useAdapter';
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
import StoreCodeRoute from '@magento/venia-ui/lib/components/StoreCodeRoute';

const Adapter = props => {
    const talonProps = useAdapter(props);
    const {
        apolloProps,
        initialized,
        reduxProps,
        routerProps,
        styleProps,
        urlHasStoreCode
    } = talonProps;

    // TODO: Replace with app skeleton. See PWA-547.
    if (!initialized) {
        return null;
    }

    const storeCodeRouteHandler = urlHasStoreCode ? <StoreCodeRoute /> : null;

    return (
        <ApolloProvider {...apolloProps}>
            <ReduxProvider {...reduxProps}>
                <BrowserRouter {...routerProps}>
                    {storeCodeRouteHandler}
                    <StyleContextProvider {...styleProps}>
                        <AppContextProvider>
                            <App />
                        </AppContextProvider>
                    </StyleContextProvider>
                </BrowserRouter>
            </ReduxProvider>
        </ApolloProvider>
    );
};

export default Adapter;
