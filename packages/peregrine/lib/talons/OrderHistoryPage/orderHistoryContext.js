import React, { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './orderHistoryContext.gql';

const OrderHistoryContext = createContext();

const OrderHistoryContextProvider = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getProductURLSuffixQuery } = operations;

    const { data } = useQuery(getProductURLSuffixQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const storeConfig = useMemo(() => {
        return {
            productURLSuffix: data ? data.storeConfig.product_url_suffix : ''
        };
    }, [data]);

    return (
        <OrderHistoryContext.Provider value={storeConfig}>
            {props.children}
        </OrderHistoryContext.Provider>
    );
};

export default OrderHistoryContextProvider;

export const useOrderHistoryContext = () => useContext(OrderHistoryContext);
