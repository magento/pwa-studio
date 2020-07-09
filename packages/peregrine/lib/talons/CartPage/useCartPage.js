import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useCartPage = props => {
    const {
        queries: { getCartDetails }
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    const [isCartUpdating, setIsCartUpdating] = useState(false);

    const { called, data, loading } = useQuery(getCartDetails, {
        fetchPolicy: 'cache-and-network',
        skip: !cartId
    });

    const handleSignIn = useCallback(() => {
        // TODO: set navigation state to "SIGN_IN". useNavigation:showSignIn doesn't work.
        toggleDrawer('nav');
    }, [toggleDrawer]);

    useEffect(() => {
        // Let the cart page know it is updating while we're waiting on network data.
        setIsCartUpdating(loading);
    }, [loading]);

    const hasItems = !!(data && data.cart.total_quantity);
    const shouldShowLoadingIndicator = called && loading && !hasItems;

    return {
        hasItems,
        handleSignIn,
        isSignedIn,
        isCartUpdating,
        setIsCartUpdating,
        shouldShowLoadingIndicator
    };
};
