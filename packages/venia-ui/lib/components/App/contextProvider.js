import React from 'react';
import {
    PeregrineContextProvider as Peregrine,
    ToastContextProvider,
    WindowSizeContextProvider
} from '@magento/peregrine';

import AppContextProvider from '../../context/app';
import CatalogContextProvider from '../../context/catalog';
import ErrorContextProvider from '../../context/unhandledErrors';
import UserContextProvider from '../../context/user';

/**
 * List of context providers that are required to run Venia
 *
 * @property {React.Component[]} contextProviders
 */
const contextProviders = [
    Peregrine,
    AppContextProvider,
    UserContextProvider,
    CatalogContextProvider,
    ErrorContextProvider,
    WindowSizeContextProvider,
    ToastContextProvider
];

const ContextProvider = ({ children }) => {
    return contextProviders.reduceRight((memo, ContextProvider) => {
        return <ContextProvider>{memo}</ContextProvider>;
    }, children);
};

export default ContextProvider;
