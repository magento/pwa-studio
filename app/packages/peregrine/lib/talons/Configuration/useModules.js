import { useState } from 'react';

import getEnabledModules from '../../RestApi/Configuration/getModules';

export const useModules = () => {
    const [enabledModules, setEnabledModules] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    let reply = {};

    class Module {
        constructor(moduleObj) {
            this.enabled = moduleObj.ENABLED;
            this.endpoint = moduleObj.ENDPOINT;
        }

        isEnabled() {
            return this.enabled;
        }

        getEndpoint() {
            return this.endpoint;
        }
    }

    const parseEnabledModules = enabledModulesObj => {
        const modules = {};

        for (const [key, value] of Object.entries(enabledModulesObj)) {
            modules[key] = new Module(value);
        }

        console.log(modules);
        return modules;
    };

    async function fetchEnabledModules() {
        try {
            reply = await getEnabledModules();
            console.log('He hecho la llamada a la API');
        } catch (err) {
            setError(err);
        } finally {
            if (reply) {
                setEnabledModules(parseEnabledModules(reply.env));
                setLoading(false);
            }
        }
    }

    fetchEnabledModules();

    return {
        enabledModules,
    };
};
