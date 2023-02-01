import { useCallback, useState } from 'react';
import getEnabledModules from '../../RestApi/Configuration/getModules';

export const useModules = () => {
    const [enabledModules, setEnabledModules] = useState({});
    const [error, setError] = useState(null);

    class Module {
        constructor(moduleObj) {
            this.enabled = Boolean(moduleObj.ENABLED === 'true');
        }

        isEnabled() {
            return this.enabled;
        }
    }

    function applyDefaultConfig() {
         const enabledModulesObj = {
            "lms": {
                "ENABLED": process.env.LMS_ENABLED
            },
            "csr": {
                "ENABLED": process.env.CSR_ENABLED
            }
        };

        return enabledModulesObj
    }

    const fetchEnabledModules = useCallback(async function() {
        const parseEnabledModules = enabledModulesObj => {
            const modules = {};
    
            for (const [key, value] of Object.entries(enabledModulesObj)) {
                modules[key] = new Module(value);
            }
    
            return modules;
        }

        if (process.env.MULTITENANT_ENABLED === 'true') {
            try {
                const reply = await getEnabledModules();
                setEnabledModules(parseEnabledModules(reply?.env));
                return reply;
            } catch (err) {
                setError(err);
            }
        } else {
            const defaultConfig = applyDefaultConfig();
            const enabledModules = parseEnabledModules(defaultConfig);
            setEnabledModules(enabledModules);
        }
    }, [ setError ]);

    return {
        enabledModules,
        fetchEnabledModules
    };
}