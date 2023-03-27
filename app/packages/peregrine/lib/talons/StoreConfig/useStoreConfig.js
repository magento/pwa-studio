import DEFAULT_OPERATIONS from './storeConfig.gql';
import mergeOperations from '../../util/shallowMerge';

import { useQuery } from '@apollo/client';

export const useStoreConfig = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getStoreConfigQuery } = operations;

    const { data, refetch } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    return {
        data,
        refetch
    };
};
