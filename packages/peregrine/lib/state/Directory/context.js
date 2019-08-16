import React, { createContext, useContext } from 'react';

import { useDirectoryState } from './state';

const DirectoryContext = createContext();

export const DirectoryContextProvider = ({ children }) => {
    const store = useDirectoryState();

    return (
        <DirectoryContext.Provider value={store}>
            {children}
        </DirectoryContext.Provider>
    );
};

export const useDirectoryContext = () => useContext(DirectoryContext);
