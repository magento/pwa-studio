import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/client';

import { useUserContext } from '../../context/user';
import { clearCartDataFromCache } from '../../Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '../../Apollo/clearCustomerDataFromCache';

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
 * @param {function} props.showSignIn - callback that shows signin view
 * @param {DocumentNode} props.signOutMutation - mutation to call when signing out
 * @param {string} props.view - string that represents the current view
 *
 * @return {{
 *  handleClose: function,
 *  handleCreateAccount: function,
 *  handleSignOut: function,
 *  setUsername: function,
 *  showCreateAccount: function,
 *  showForgotPassword: function,
 *  showMyAccount: function,
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
        showSignIn,
        signOutMutation,
        view
    } = props;

    const apolloClient = useApolloClient();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [username, setUsername] = useState('');
    const [{ currentUser, isSignedIn }, { signOut }] = useUserContext();
    const [revokeToken] = useMutation(signOutMutation);
    const history = useHistory();

    // If the user is authed, the only valid view is "MY_ACCOUNT".
    // view an also be `MENU` but in that case we don't want to act.
    useEffect(() => {
        if (currentUser && currentUser.email && UNAUTHED_ONLY.includes(view)) {
            showMyAccount();
        }
    }, [currentUser, showMyAccount, view]);

    // If the user token was invalidated by way of expiration, we need to reset
    // the view back to the main menu.
    useEffect(() => {
        if (!isSignedIn && view === 'MY_ACCOUNT' && !isSigningOut) {
            showMainMenu();
        }
    }, [isSignedIn, isSigningOut, showMainMenu, view]);

    const handleClose = useCallback(() => {
        showMainMenu();
        closeDrawer();
    }, [closeDrawer, showMainMenu]);

    const handleCancel = useCallback(() => {
        showSignIn();
    }, [showSignIn]);

    const handleCreateAccount = useCallback(() => {
        showMyAccount();
    }, [showMyAccount]);

    const handleSignOut = useCallback(async () => {
        setIsSigningOut(true);

        // Delete cart/user data from the redux store.
        await signOut({ revokeToken });
        await clearCartDataFromCache(apolloClient);
        await clearCustomerDataFromCache(apolloClient);

        // Refresh the page as a way to say "re-initialize". An alternative
        // would be to call apolloClient.resetStore() but that would require
        // a large refactor.
        history.go(0);
    }, [apolloClient, history, revokeToken, signOut]);

    return {
        handleCancel,
        handleClose,
        handleCreateAccount,
        handleSignOut,
        setUsername,
        showCreateAccount,
        showForgotPassword,
        showMyAccount,
        username
    };
};
