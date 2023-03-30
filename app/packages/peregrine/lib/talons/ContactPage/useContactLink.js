import { useMemo } from 'react';
import { useStoreConfigContext } from '@magento/peregrine/lib/context/storeConfigProvider';

export default () => {
        const { data: storeConfigData } = useStoreConfigContext();

    const isEnabled = useMemo(() => {
        return !!storeConfigData?.storeConfig?.contact_enabled;
    }, [storeConfigData]);

    return {
        isEnabled,
        isLoading: storeConfigData === undefined
    };
};
