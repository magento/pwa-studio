import { useCallback, useMemo } from 'react';
import { useStyle } from './useStyle';
import { useModules } from './useModules';

export const useConfig = () => {
    
    const { applyStyles } = useStyle();
    const { enabledModules, fetchEnabledModules } = useModules();

    const applyConfig = useCallback(() => {
        applyStyles();
        fetchEnabledModules();
    }, [applyStyles, fetchEnabledModules]);
    
    const value = useMemo(() => ({
        enabledModules,
        applyConfig,
    }), [enabledModules, applyConfig]);

    return {
        applyConfig,
        value
    };
}