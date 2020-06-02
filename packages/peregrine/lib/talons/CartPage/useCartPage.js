import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

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

    const { data, loading } = useQuery(getCartDetails, {
        // TODO: Purposely overfetch and hit the network until all components
        // are correctly updating the cache. Will be fixed by PWA-321.
        fetchPolicy: 'cache-and-network',
        // Don't make this call if we don't have a cartId
        skip: !cartId,
        variables: { cartId }
    });

    const handleSignIn = useCallback(() => {
        // TODO: set navigation state to "SIGN_IN". useNavigation:showSignIn doesn't work.
        toggleDrawer('nav');
    }, [toggleDrawer]);

    useEffect(() => {
        // Let the cart page know it is updating while we're waiting on network data.
        setIsCartUpdating(loading);
    }, [loading]);

    return {
        hasItems: !!(data && data.cart.total_quantity),
        handleSignIn,
        isSignedIn,
        isCartUpdating,
        setIsCartUpdating
    };
};
