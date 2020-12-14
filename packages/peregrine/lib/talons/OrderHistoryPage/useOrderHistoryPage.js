import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';
import DEFAULT_OPERATIONS from './orderHistoryPage.gql';

export const useOrderHistoryPage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCustomerOrdersQuery, getCustomerOrderQuery } = operations;

    const [orders, setOrders] = useState([]);
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    const { data: ordersData, loading: ordersLoading } = useQuery(
        getCustomerOrdersQuery,
        {
            fetchPolicy: 'cache-and-network',
            skip: !isSignedIn
        }
    );

    const [
        getOrderData,
        { data: orderData, error: orderError, loading: orderLoading }
    ] = useLazyQuery(getCustomerOrderQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isSignedIn
    });

    const isLoadingWithoutData =
        (!ordersData && ordersLoading) || (!orderData && orderLoading);
    const isBackgroundLoading =
        (!!ordersData && ordersLoading) || (!!orderData && orderLoading);

    useEffect(() => {
        if (ordersData) {
            setOrders(ordersData.customer.orders.items);
        }
    }, [ordersData]);
    useEffect(() => {
        if (orderData) {
            setOrders(orderData.customer.orders.items);
        }
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

    const getOrderDetails = useCallback(
        orderNumber => {
            if (orderNumber) {
                getOrderData({
                    variables: {
                        orderNumber: {
                            number: {
                                eq: orderNumber
                            }
                        }
                    }
                });
            }
        },
        [getOrderData]
    );

    return {
        isLoadingWithoutData,
        orders,
        getOrderDetails
    };
};
