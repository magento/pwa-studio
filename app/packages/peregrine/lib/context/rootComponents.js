import React, { createContext, useContext, useState } from 'react';

const RootComponentsContext = createContext();

const RootComponentsProvider = props => {
    const { children } = props;
    const state = useState(new Map());

    return (
        <RootComponentsContext.Provider value={state}>
            {children}
        </RootComponentsContext.Provider>
    );
};

export default RootComponentsProvider;
export const useRootComponents = () => useContext(RootComponentsContext);
