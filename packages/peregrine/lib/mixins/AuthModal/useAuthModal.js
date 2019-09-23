import { useCallback, useEffect, useState } from 'react';
import { useUserContext } from '../../context/user';

const UNAUTHED_ONLY = ['CREATE_ACCOUNT', 'FORGOT_PASSWORD', 'SIGN_IN'];

export const useAuthModal = props => {
    const {
        closeDrawer,
        showCreateAccount,
        showForgotPassword,
        showMainMenu,
        showMyAccount,
        view
    } = props;

    const [username, setUsername] = useState('');
    const [{ currentUser }, { createAccount, signOut }] = useUserContext();

    // if the user is authed, the only valid view is "MY_ACCOUNT"
    useEffect(() => {
        if (currentUser && currentUser.id && UNAUTHED_ONLY.includes(view)) {
            showMyAccount();
        }
    }, [currentUser, showMyAccount, view]);

    const handleClose = useCallback(() => {
        showMainMenu();
        closeDrawer();
    }, [closeDrawer, showMainMenu]);

    const handleCreateAccount = useCallback(
        async values => {
            await createAccount(values);
            showMyAccount();
        },
        [createAccount, showMyAccount]
    );

    const handleSignOut = useCallback(() => {
        signOut();
    }, [signOut]);

    return {
        currentUser,
        handleClose,
        handleCreateAccount,
        handleSignOut,
        setUsername,
        showCreateAccount,
        showForgotPassword,
        username
    };
};
