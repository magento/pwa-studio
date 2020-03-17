import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useApolloClient, useLazyQuery, useMutation } from '@apollo/react-hooks';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useCartPage = props => {
    const {
        queries: { getCartDetails },
        mutations: { signOutMutation }
    } = props;

    const { resetStore } = useApolloClient();
    const history = useHistory();

    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }, { signOut }] = useUserContext();
    const [{ cartId }] = useCartContext();

    const [isCartUpdating, setIsCartUpdating] = useState(false);

    const [revokeToken] = useMutation(signOutMutation);
    const [fetchCartData, { data }] = useLazyQuery(getCartDetails, {
        // TODO: Purposely overfetch and hit the network until all components
        // are correctly updating the cache. Will be fixed by PWA-321.
        fetchPolicy: 'cache-and-network'
    });

    const handleSignInToggle = useCallback(async () => {
        if (isSignedIn) {
            // After logout, reset the store to set the bearer token.
            // https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
            await resetStore();
            await signOut({ revokeToken });

            // Refresh this page.
            history.go(0);
        }
        else {
            toggleDrawer('nav');
        }
    }, [history, isSignedIn, resetStore, revokeToken, signOut, toggleDrawer]);

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
        handleSignInToggle,
        isSignedIn,
        isCartUpdating,
        setIsCartUpdating
    };
};
