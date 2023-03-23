import React, { useContext } from 'react';

import { useStoreConfig } from '../talons/StoreConfig/useStoreConfig';

const StoreConfigContext = React.createContext();

export const StoreConfigProvider = ({ children }) => {
    const value = useStoreConfig();

    return <StoreConfigContext.Provider value={value}>{children}</StoreConfigContext.Provider>;
};

export const useStoreConfigContext = () => {
    return useContext(StoreConfigContext);
};
