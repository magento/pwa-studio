import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './orderHistoryPage.gql';

import { useHistory } from 'react-router-dom';

const PAGE_SIZE = 10;

export const useOrderHistoryPage = (props, ...restArgs) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, restArgs.operations);
    const { getCustomerOrdersQuery, getStoreConfigData } = operations;

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [searchText, setSearchText] = useState('');

    const { data: orderData, error: getOrderError, loading: orderLoading } = useQuery(getCustomerOrdersQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            filter: {
                number: {
                    match: searchText
                }
            },
            pageSize
        }
    });

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const ordersInitial = orderData ? orderData.customer.orders.items : [];

    let newSortOrder = [...ordersInitial];

    const orders = newSortOrder.sort((a, b) => (a.order_date < b.order_date ? 1 : -1));

    const isLoadingWithoutData = !orderData && orderLoading;
    const isBackgroundLoading = !!orderData && orderLoading;

    const pageInfo = useMemo(() => {
        if (orderData) {
            const { total_count } = orderData.customer.orders;

            return {
                current: pageSize < total_count ? pageSize : total_count,
                total: total_count
            };
        }

        return null;
    }, [orderData, pageSize]);

    const derivedErrorMessage = useMemo(() => deriveErrorMessage([getOrderError]), [getOrderError]);

    const handleReset = useCallback(() => {
        setSearchText('');
    }, []);

    const handleSubmit = useCallback(({ search }) => {
        setSearchText(search);
    }, []);

    const loadMoreOrders = useMemo(() => {
        if (orderData) {
            const { page_info } = orderData.customer.orders;
            const { current_page, total_pages } = page_info;

            if (current_page < total_pages) {
                return () => setPageSize(current => current + PAGE_SIZE);
            }
        }

        return null;
    }, [orderData]);

    // If the user is no longer signed in, redirect to the home page.
    useEffect(() => {
        if (!isSignedIn) {
            history.push('/');
        }
    }, [history, isSignedIn]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    return {
        errorMessage: derivedErrorMessage,
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        loadMoreOrders,
        orders,
        pageInfo,
        searchText,
        searchText,
        storeConfigData
    };
};
