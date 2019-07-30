import React, { createContext, useContext } from 'react';

import { useFiltersState } from './state';

const FiltersContext = createContext();

export const FiltersContextProvider = ({ children }) => {
    const store = useFiltersState();

    return (
        <FiltersContext.Provider value={store}>
            {children}
        </FiltersContext.Provider>
    );
};

export const useFiltersContext = () => useContext(FiltersContext);
