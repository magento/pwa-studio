import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';

import DEFAULT_OPERATIONS from '../queries/getExtensionContext.gql.js';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const useExtensionContext = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getExtensionContextQuery } = operations;

    const [fetchExtensionContext, { called, data, loading, error }] = useLazyQuery(getExtensionContextQuery);

    useEffect(() => {
        fetchExtensionContext();
    }, [fetchExtensionContext]);

    return {
        ready: called && !loading,
        data,
        error
    };
};

export default useExtensionContext;
