import React, { useState, useContext } from 'react';

const StoreLocatorContext = React.createContext();

export const StoreLocatorProvider = ({ children }) => {
    const [hello, setHello] = useState('hello');

    return <StoreLocatorContext.Provider value={{ hello }}>{children}</StoreLocatorContext.Provider>;
};

export const useStoreLocatorContext = () => {
    return useContext(StoreLocatorContext);
};
