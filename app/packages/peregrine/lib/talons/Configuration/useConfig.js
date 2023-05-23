import { useCallback, useMemo } from 'react';
import { useStyle } from './useStyle';
import { useModules } from './useModules';

export const useConfig = () => {
    
    const { applyStyles } = useStyle();
    const { tenantConfig, fetchTenantConfig } = useModules();

    const applyConfig = useCallback(() => {
        applyStyles();
        fetchTenantConfig();
    }, [applyStyles, fetchTenantConfig]);
    
    const value = useMemo(() => ({
        tenantConfig,
        applyConfig
    }), [tenantConfig, applyConfig]);

    return {
        applyConfig,
        value
    };
}