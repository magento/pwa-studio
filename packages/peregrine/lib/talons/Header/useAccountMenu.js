import { useState, useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/react-hooks';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';

/**
 * The useAccountTrigger talon complements the AccountTrigger component.
 *
 * @returns {Object}    talonProps
 * @returns {Boolean}   talonProps.accountMenuIsOpen - Whether the menu that this trigger toggles is open or not.
 * @returns {Ref}       talonProps.accountMenuRef - A React ref to the menu that this trigger toggles.
 * @returns {Ref}       talonProps.accountMenuTriggerRef - A React ref to the trigger element itself.
 * @returns {Function}  talonProps.handleSignOut - A function for handling sign out.
 * @returns {Function}  talonProps.handleTriggerClick - A function for handling when the trigger is clicked.
 * @returns {Boolean}   talonProps.isUserSignedIn - Whether there is a user currently signed in or not.
 */
export const useAccountMenu = props => {
    const { mutations, accountMenuIsOpen, setAccountMenuIsOpen } = props;
    const { signOut: signOutMutation } = mutations;

    const [view, setView] = useState('SIGNIN');
    const [username, setUsername] = useState('');

    const apolloClient = useApolloClient();
    const history = useHistory();
    const location = useLocation();
    const [revokeToken] = useMutation(signOutMutation);
    const [{ isSignedIn: isUserSignedIn }, { signOut }] = useUserContext();

    const handleSignOut = useCallback(async () => {
        setView('SIGNIN');
        setAccountMenuIsOpen(false);

        // Delete cart/user data from the redux store.
        await signOut({ revokeToken });
        await clearCartDataFromCache(apolloClient);
        await clearCustomerDataFromCache(apolloClient);

        // Refresh the page as a way to say "re-initialize". An alternative
        // would be to call apolloClient.resetStore() but that would require
        // a large refactor.
        history.go(0);
    }, [apolloClient, history, revokeToken, setAccountMenuIsOpen, signOut]);

    const handleForgotPassword = useCallback(() => {
        setView('FORGOT_PASSWORD');
    }, []);

    const handleCreateAccount = useCallback(() => {
        setView('CREATE_ACCOUNT');
    }, []);

    // Close the Account Menu on page change.
    useEffect(() => {
        setAccountMenuIsOpen(false);
    }, [location.pathname, setAccountMenuIsOpen]);

    // Update view based on user status everytime accountMenuIsOpen has changed.
    useEffect(() => {
        if (isUserSignedIn) {
            setView('ACCOUNT');
        } else {
            setView('SIGNIN');
        }
    }, [accountMenuIsOpen, isUserSignedIn]);

    return {
        accountMenuIsOpen,
        handleSignOut,
        isUserSignedIn,
        handleForgotPassword,
        handleCreateAccount,
        view,
        username,
        setUsername
    };
};
