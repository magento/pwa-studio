import { useLazyQuery } from '@apollo/client';
import { GET_STOREFRONT_CONTEXT } from '../queries/getStorefrontContext.gql.js';
import { useEffect } from 'react';

const useStorefrontInstanceContext = () => {
    const [fetchStorefrontContext, { called, data, loading }] = useLazyQuery(
        GET_STOREFRONT_CONTEXT
    );
    useEffect(() => {
        fetchStorefrontContext();
    }, [fetchStorefrontContext]);

    return {
        ready: called && !loading,
        data
    };
};

export default useStorefrontInstanceContext;
