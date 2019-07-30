import React, { createContext, useContext } from 'react';

import { useCartState } from './state';

const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const store = useCartState();

    return (
        <CartContext.Provider value={store}>{children}</CartContext.Provider>
    );
};

export const useCartContext = () => useContext(CartContext);
