import React from 'react';
import { arrayOf, oneOf } from 'prop-types';
import { ToastContextProvider } from '../Toasts';
import { WindowSizeContextProvider } from '../hooks/useWindowSize';

const contextProviders = {
    TOASTS: ToastContextProvider,
    WINDOW_SIZE: WindowSizeContextProvider
};

const Peregrine = ({ children, providers }) => {
    return providers.reduceRight((memo, providerKey) => {
        const ContextProvider = contextProviders[providerKey];
        return <ContextProvider>{memo}</ContextProvider>;
    }, children);
};

Peregrine.propTypes = {
    providers: arrayOf(oneOf(Object.keys(contextProviders)))
};

Peregrine.defaultProps = {
    providers: ['WINDOW_SIZE', 'TOASTS']
};

export default Peregrine;
