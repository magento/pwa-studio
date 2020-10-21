import React, { createContext, useContext, useMemo } from 'react';

import DEFAULT_OPERATIONS from './orderHistoryContext.gql';
import { useQuery } from '@apollo/client';

const OrderHistoryContext = createContext();

export const OrderHistoryContextProvider = props => {
    const operations = Object.assign({}, DEFAULT_OPERATIONS, props.operations);
    const { getProductURLSuffixQuery } = operations;

    const { data } = useQuery(getProductURLSuffixQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const storeConfig = useMemo(() => {
        return {
            productURLSuffix: data
                ? data.storeConfig.product_url_suffix
                : '.html'
        };
    }, [data]);

    return (
        <OrderHistoryContext.Provider value={storeConfig}>
            {props.children}
        </OrderHistoryContext.Provider>
    );
};

export const useOrderHistoryContext = () => useContext(OrderHistoryContext);
