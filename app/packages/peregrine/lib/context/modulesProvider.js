import React, { useContext } from 'react';

import { useConfig } from '../talons/Configuration/useConfig';

const ModulesContext = React.createContext();

export const ModulesProvider = ({ children }) => {
    const { value } = useConfig();
    
    return (
        <ModulesContext.Provider value={value}>
            {children}
        </ModulesContext.Provider>
    );    
};

export const useModulesContext = () => {
    return useContext(ModulesContext);
};
