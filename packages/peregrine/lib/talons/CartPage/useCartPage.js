import { useCallback } from 'react';

import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';

export const useCartPage = () => {
    const [, appApi] = useAppContext();
    const { toggleDrawer } = appApi;
    const [{ isSignedIn }] = useUserContext();

    const handleSignIn = useCallback(() => {
        // TODO: export the drawer names
        // TODO: set navigation state to "SIGN_IN". useNavigation:showSignIn doesn't work.
        toggleDrawer('nav');
    }, [toggleDrawer]);

    return {
        handleSignIn,
        isSignedIn
    };
};
