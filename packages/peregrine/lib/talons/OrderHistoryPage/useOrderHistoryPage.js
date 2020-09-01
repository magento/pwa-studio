import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';
import { useTypePolicies } from '../../hooks/useTypePolicies';

export const useOrderHistoryPage = props => {
    const { queries, types } = props;
    const { getCustomerOrdersQuery } = queries;

    useTypePolicies(types);

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
    const isBackgroundLoading = !!data && loading;
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
