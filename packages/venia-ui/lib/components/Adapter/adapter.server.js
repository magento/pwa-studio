import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';

import { useAdapter } from '@magento/peregrine/lib/talons/Adapter/useAdapter';
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
import StoreCodeRoute, {
    getStoreDataFromUrl
} from '@magento/venia-ui/lib/components/StoreCodeRoute';
import GlobalContextProvider from '@magento/peregrine/lib/context/global';

const Adapter = props => {
    const {
        url,
        origin,
        cookies: { store_view_currency },
        staticContext,
        dom
    } = props;
    const talonProps = useAdapter(props);
    const {
        apolloProps,
        reduxProps,
        routerProps,
        urlHasStoreCode
    } = talonProps;

    if (!staticContext.apollo.client) {
        staticContext.apollo.client = apolloProps.client;
    }

    const { storeCurrency: currencyFromUrl } = getStoreDataFromUrl(url);

    const storeCurrency = store_view_currency || currencyFromUrl;

    const children = props.children || <App />;
    const storeCodeRouteHandler = urlHasStoreCode ? <StoreCodeRoute /> : null;

    const staticRouterProps = {
        context: staticContext
    };
    if (urlHasStoreCode) {
        // Change the currency on client if it differs from the requested
        if (store_view_currency && store_view_currency !== storeCurrency) {
            staticRouterProps.context.cookies.store_view_currency = storeCurrency;
        }
    }

    return (
        <ApolloProvider {...apolloProps}>
            <ReduxProvider {...reduxProps}>
                <StaticRouter {...routerProps} {...staticRouterProps}>
                    <GlobalContextProvider origin={origin} url={url} dom={dom}>
                        {storeCodeRouteHandler}
                        <AppContextProvider>{children}</AppContextProvider>
                    </GlobalContextProvider>
                </StaticRouter>
            </ReduxProvider>
        </ApolloProvider>
    );
};

Adapter.defaultProps = {
    apollo: {}
};

export default Adapter;
