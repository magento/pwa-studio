import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormState, useFormApi } from 'informed';
import debounce from 'lodash.debounce';
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
    const formState = useFormState();
    const formApi = useFormApi();

    const searchText = useMemo(() => {
        return formState.values.search;
    }, [formState]);

    const { data: ordersData, loading: ordersLoading } = useQuery(
        getCustomerOrdersQuery,
        {
            fetchPolicy: 'cache-and-network',
            skip: !isSignedIn
        }
    );

    const [
        getOrderData,
        { data: orderData, loading: orderLoading }
    ] = useLazyQuery(getCustomerOrderQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isSignedIn
    });

    const isLoadingWithoutData = !orders && (orderLoading || ordersLoading);
    const isBackgroundLoading = !!orders && (orderLoading || ordersLoading);

    const debouncedOrderDetailsFetcher = useCallback(
        debounce(
            orderNumber => {
                if (orderNumber) {
                    console.log(orderNumber);

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
            1000,
            { leading: false }
        ),
        [getOrderData]
    );

    /**
     * Using wrapper function instead of debounced function
     * because event object will be unavailable after the
     * timer expires.
     */
    const getOrderDetails = useCallback(
        event => {
            debouncedOrderDetailsFetcher(event.target.value);
        },
        [debouncedOrderDetailsFetcher]
    );

    const resetForm = useCallback(() => {
        formApi.reset();
    }, [formApi]);

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

    /**
     * If there is no search string show all orders
     */
    useEffect(() => {
        if (!searchText && ordersData) {
            setOrders(ordersData.customer.orders.items);
        }
    }, [ordersData, searchText]);

    /**
     * If there is a search string, show only the orders related
     * to that search.
     */
    useEffect(() => {
        const orderNumber =
            orderData && orderData.customer.orders.items.length
                ? orderData.customer.orders.items[0].number
                : null;

        if (searchText && orderNumber && orderNumber === searchText) {
            setOrders(orderData.customer.orders.items);
        }
    }, [orderData, searchText]);

    return {
        isBackgroundLoading,
        isLoadingWithoutData,
        orders,
        getOrderDetails,
        resetForm,
        searchText
    };
};
