import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import { useUserContext } from '../../context/user';

export const useWishlistPage = props => {
    const { queries } = props;
    const { getCustomerWishlistQuery } = queries;

    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    const { data } = useQuery(getCustomerWishlistQuery, { skip: !isSignedIn });

    const derivedWishlists = useMemo(() => {
        return (data && data.customer.wishlists) || [];
    }, [data]);

    useEffect(() => {
        if (!isSignedIn) {
            history.push('/');
        }
    }, [history, isSignedIn]);

    return {
        wishlists: derivedWishlists
    };
};
