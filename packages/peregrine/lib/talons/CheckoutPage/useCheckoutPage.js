import { useCallback } from 'react';

import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';
import { useCartContext } from '../../context/cart';

export const useCheckoutPage = () => {
    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();
    const [{ isEmpty }] = useCartContext();

    const handleSignIn = useCallback(() => {
        toggleDrawer('nav');
    }, [toggleDrawer]);

    return [
        { isGuestCheckout: !isSignedIn, isCartEmpty: isEmpty },
        {
            handleSignIn
        }
    ];
};
