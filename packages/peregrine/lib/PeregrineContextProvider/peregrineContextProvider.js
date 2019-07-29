import React from 'react';

import { CheckoutContextProvider } from '../state/Checkout';
import { UserContextProvider } from '../state/User';

/**
 * List of essential context providers that are required to run Peregrine
 *
 * @property {React.Component[]} contextProviders
 */
const contextProviders = [CheckoutContextProvider, UserContextProvider];

const PeregrineContextProvider = ({ children }) => {
    return contextProviders.reduceRight((memo, ContextProvider) => {
        return <ContextProvider>{memo}</ContextProvider>;
    }, children);
};

export default PeregrineContextProvider;
