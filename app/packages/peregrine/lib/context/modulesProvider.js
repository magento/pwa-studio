import React, { useState, useContext, useMemo, useCallback } from 'react';
import getEnabledModules from '../RestApi/Configuration/getModules';

const ModulesContext = React.createContext();

export const ModulesProvider = ({ children }) => {
    const [enabledModules, setEnabledModules] = useState({});
    const [error, setError] = useState(null);
    // const [loading, setLoading] = useState(true);

    class Module {
        constructor(moduleObj) {
            this.enabled = moduleObj.ENABLED;
        }

        isEnabled() {
            return this.enabled;
        }
    }

    const memoizedFetchEnabledModules = useCallback(async function() {
        const parseEnabledModules = enabledModulesObj => {
            const modules = {};
    
            for (const [key, value] of Object.entries(enabledModulesObj)) {
                modules[key] = new Module(value);
            }
    
            return modules;
        }
    
        try {
            const reply = await getEnabledModules();
            setEnabledModules(parseEnabledModules(reply?.env));
            return reply;
        } catch (err) {
            setError(err);
        }
    }, [ setError ]);
    
    const value = useMemo(() => ({
        enabledModules,
        fetchEnabledModules: memoizedFetchEnabledModules
    }), [enabledModules, memoizedFetchEnabledModules]);
    
    return (
        <ModulesContext.Provider value={value}>
            {children}
        </ModulesContext.Provider>
    );    
};

export const useModulesContext = () => {
    return useContext(ModulesContext);
};
