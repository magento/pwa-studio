import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';
import { deriveErrorMessage } from '../../util/deriveErrorMessage';

import DEFAULT_OPERATIONS from './orderHistoryPage.gql';

export const useOrderHistoryPage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCustomerOrderQuery } = operations;

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    const [searchText, setSearchText] = useState('');

    const {
        data: orderData,
        loading: orderLoading,
        error: getOrderError
    } = useQuery(getCustomerOrderQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            orderNumber: {
                number: {
                    match: searchText
                }
            }
        }
    });

    const orders = orderData ? orderData.customer.orders.items : [];

    const isLoadingWithoutData = !orders && orderLoading;
    const isBackgroundLoading = !!orders && orderLoading;

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([getOrderError]),
        [getOrderError]
    );

    const handleReset = useCallback(() => {
        setSearchText('');
        console.log('woof');
    }, []);

    const handleSubmit = useCallback(({ search }) => {
        setSearchText(search);
    }, []);

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
        orders,
        searchText
    };
};
