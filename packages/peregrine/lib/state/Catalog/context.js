import React, { createContext, useContext } from 'react';

import { useCatalogState } from './state';

const CatalogContext = createContext();

export const CatalogContextProvider = ({ children }) => {
    const store = useCatalogState();

    return (
        <CatalogContext.Provider value={store}>
            {children}
        </CatalogContext.Provider>
    );
};

export const useCatalogContext = () => useContext(CatalogContext);
