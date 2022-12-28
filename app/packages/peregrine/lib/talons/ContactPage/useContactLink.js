import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './contactUs.gql';

export default (props = {}) => {
    const { getStoreConfigQuery } = mergeOperations(
        DEFAULT_OPERATIONS,
        props.operations
    );

    const { data: storeConfigData, loading: configLoading } = useQuery(
        getStoreConfigQuery,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const isEnabled = useMemo(() => {
        return !!storeConfigData?.storeConfig?.contact_enabled;
    }, [storeConfigData]);

    return {
        isEnabled,
        isLoading: configLoading
    };
};
