import { useMemo } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { useUserContext } from '../../context/user';

export const useWishlistPage = props => {
    const { queries } = props;
    const { getCustomerWishlistQuery } = queries;

    const [{ isSignedIn }] = useUserContext();

    const { data } = useQuery(getCustomerWishlistQuery, { skip: !isSignedIn });

    const derivedWishlists = useMemo(() => {
        return (data && data.customer.wishlists) || [];
    }, [data]);

    return {
        wishlists: derivedWishlists
    };
};
