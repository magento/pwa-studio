import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormState, useFormApi } from 'informed';
import { useLazyQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';
import { deriveErrorMessage } from '../../util/deriveErrorMessage';

import DEFAULT_OPERATIONS from './orderHistoryPage.gql';

export const useOrderHistoryPage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCustomerOrderQuery } = operations;

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

    const [
        getOrderData,
        { loading: orderLoading, error: getOrderError }
    ] = useLazyQuery(getCustomerOrderQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        onCompleted: orderData => {
            setOrders(orderData.customer.orders.items);
        }
    });

    const getOrdersData = useCallback(() => {
        getOrderData({
            variables: {
                orderNumber: {
                    number: {
                        match: ''
                    }
                }
            }
        });
    }, [getOrderData]);

    const isLoadingWithoutData = !orders && orderLoading;
    const isBackgroundLoading = !!orders && orderLoading;

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([getOrderError]),
        [getOrderError]
    );

    const getOrderDetails = useCallback(() => {
        if (!isBackgroundLoading && searchText) {
            getOrderData({
                variables: {
                    orderNumber: {
                        number: {
                            match: searchText
                        }
                    }
                }
            });
        }
    }, [isBackgroundLoading, getOrderData, searchText]);

    const resetForm = useCallback(
        event => {
            event.stopPropagation();

            formApi.reset();
            getOrdersData();
        },
        [formApi, getOrdersData]
    );

    const handleKeyPress = useCallback(
        event => {
            if (event.key === 'Enter') {
                getOrderDetails();
            }
        },
        [getOrderDetails]
    );

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

    // Fetch orders data on load
    useEffect(() => {
        getOrdersData();
    }, [getOrdersData, isSignedIn]);

    return {
        errorMessage: derivedErrorMessage,
        getOrderDetails,
        handleKeyPress,
        isBackgroundLoading,
        isLoadingWithoutData,
        orders,
        resetForm,
        searchText
    };
};
