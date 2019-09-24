import { useCallback, useEffect, useState } from 'react';
import { useUserContext } from '../../context/user';

const UNAUTHED_ONLY = ['CREATE_ACCOUNT', 'FORGOT_PASSWORD', 'SIGN_IN'];

/**
 * Returns props necessary to render an AuthModal component.
 *
 * @param {object} props
 * @param {function} props.closeDrawer - callback that closes drawer
 * @param {function} props.showCreateAccount - callback that shows create account view
 * @param {function} props.showForgotPassword - callback that shows forgot password view
 * @param {function} props.showMainMenu - callback that shows main menu view
 * @param {function} props.showMyAccount - callback that shows my account view
 * @param {string} props.view - enum string of current view
 * @return {{
 *  handleClose: function,
 *  handleCreateAccount: function,
 *  handleSignOut: function,
 *  setUsername: function,
 *  showCreateAccount: function,
 *  showForgotPassword: function,
 *  username: string
 * }}
 */
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
        handleClose,
        handleCreateAccount,
        handleSignOut,
        setUsername,
        showCreateAccount,
        showForgotPassword,
        username
    };
};
