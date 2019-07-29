import React, { createContext, useContext } from 'react';

import { useUserState } from './state';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const store = useUserState();

    return (
        <UserContext.Provider value={store}>{children}</UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
