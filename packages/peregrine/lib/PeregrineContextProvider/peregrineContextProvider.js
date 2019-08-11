import React from 'react';

/**
 * List of essential context providers that are required to run Peregrine
 *
 * @property {React.Component[]} contextProviders
 */
const contextProviders = [];

const PeregrineContextProvider = ({ children }) => {
    return contextProviders.reduceRight((memo, ContextProvider) => {
        return <ContextProvider>{memo}</ContextProvider>;
    }, children);
};

export default PeregrineContextProvider;
