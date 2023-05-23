import { useStoreConfigContext } from '@magento/peregrine/lib/context/storeConfigProvider';

export const useStoreConfigData = () => {
        const { data: storeConfigData } = useStoreConfigContext();

    return {
        storeConfigData
    };
};
