import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { useUserContext } from '../../context/user';

export const useWishlistPage = props => {
    const { queries } = props;
    const { getCustomerWishlistQuery } = queries;

    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    const { data, error } = useQuery(getCustomerWishlistQuery, {
        fetchPolicy: 'cache-and-network',
        skip: !isSignedIn
    });

    const derivedWishlists = useMemo(() => {
        return (data && data.customer.wishlists) || [];
    }, [data]);

    const errors = useMemo(() => {
        return new Map([['getCustomerWishlistQuery', error]]);
    }, [error]);

    useEffect(() => {
        if (!isSignedIn) {
            history.push('/');
        }
    }, [history, isSignedIn]);

    return {
        errors,
        wishlists: derivedWishlists
    };
};
