import { useCallback, useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useCartPage = props => {
    const {
        queries: { GET_CART_DETAILS, GET_CART_IS_UPDATING }
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }] = useCartContext();

    // Update cart interactibility state based on this query.
    const { data: cartIsUpdatingData } = useQuery(GET_CART_IS_UPDATING);

    const [fetchCartData, { data }] = useLazyQuery(GET_CART_DETAILS, {
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
        isUpdating: cartIsUpdatingData && cartIsUpdatingData.cartIsUpdating
    };
};
