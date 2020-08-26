import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useQuery } from '@apollo/react-hooks';

/**
 *  A talon to support the functionality of the Order History page.
 *
 *  @returns {Object}   talonProps
 *  @returns {Object}   talonProps.data - The user's order history data.
 *  @returns {Boolean}  talonProps.isLoading - Indicates whether the user's
 *      order history data is loading.
 */
export const useOrderHistoryPage = props => {
    const { queries } = props;
    const { getCustomerOrdersQuery } = queries;

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    const { data, loading } = useQuery(getCustomerOrdersQuery, {
        fetchPolicy: 'cache-and-network',
        skip: !isSignedIn
    });

    const isLoadingWithoutData = !data && loading;
    const isBackgroundLoading = data && loading;
    const orders = useMemo(() => {
        if (data) {
            return data.customer.orders.items;
        }

        return [];
    }, [data]);

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
        isLoadingWithoutData,
        orders
    };
};
