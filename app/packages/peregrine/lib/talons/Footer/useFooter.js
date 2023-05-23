import { useStoreConfigContext } from '@magento/peregrine/lib/context/storeConfig';

/**
 *
 * @param {*} props.operations GraphQL operations used by talons
 */

export const useFooter = () => {
        const { data: storeConfigData } = useStoreConfigContext();

    return {
        copyrightText: storeConfigData && storeConfigData.storeConfig && storeConfigData.storeConfig.copyright
    };
};
