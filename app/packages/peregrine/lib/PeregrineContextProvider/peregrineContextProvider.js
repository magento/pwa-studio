import React from 'react';

import AppContextProvider from '../context/app';
import CartContextProvider from '../context/cart';
import CatalogContextProvider from '../context/catalog';
import CheckoutContextProvider from '../context/checkout';
import ErrorContextProvider from '../context/unhandledErrors';
import EventingContextProvider from '../context/eventing';
import RootComponentsProvider from '../context/rootComponents';
import UserContextProvider from '../context/user';

/**
 * List of essential context providers that are required to run Peregrine
 *
 * @property {React.Component[]} contextProviders
 */
const contextProviders = [
    ErrorContextProvider,
    EventingContextProvider,
    AppContextProvider,
    UserContextProvider,
    CatalogContextProvider,
    CartContextProvider,
    CheckoutContextProvider,
    RootComponentsProvider
];

const PeregrineContextProvider = ({ children }) => {
    return contextProviders.reduceRight((memo, ContextProvider) => {
        return <ContextProvider>{memo}</ContextProvider>;
    }, children);
};

export default PeregrineContextProvider;
