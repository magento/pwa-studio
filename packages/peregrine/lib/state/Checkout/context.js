import React, { createContext, useContext } from 'react';

import { useCheckoutState } from './state';

const CheckoutContext = createContext();

export const CheckoutContextProvider = ({ children }) => {
    const store = useCheckoutState();

    return (
        <CheckoutContext.Provider value={store}>
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckoutContext = () => useContext(CheckoutContext);
