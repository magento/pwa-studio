import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useCartPage = props => {
    const {
        queries: { getCartDetails }
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }] = useCartContext();

    const [isCartUpdating, setIsCartUpdating] = useState(false);

    const [fetchCartData, { data }] = useLazyQuery(getCartDetails, {
        // TODO: Purposely overfetch and hit the network until all components
        // are correctly updating the cache. Will be fixed by PWA-321.
        fetchPolicy: 'cache-and-network'
    });

    const handleSignIn = useCallback(() => {
        // TODO: set navigation state to "SIGN_IN". useNavigation:showSignIn doesn't work.
        toggleDrawer('nav');
    }, [toggleDrawer]);

    useEffect(() => {
        if (cartId) {
            fetchCartData({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchCartData]);

    return {
        hasItems: !!(data && data.cart.total_quantity),
        handleSignIn,
        isSignedIn,
        isCartUpdating,
        setIsCartUpdating
    };
};
