import { useState, useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/react-hooks';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
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
export const useAccountTrigger = props => {
    const { mutations, VIEWS } = props;
    const { signOut: signOutMutation } = mutations;

    const [view, setView] = useState(VIEWS.SIGNIN);
    const [username, setUsername] = useState('');

    const {
        elementRef: accountMenuRef,
        expanded: accountMenuIsOpen,
        setExpanded: setAccountMenuIsOpen,
        triggerRef: accountMenuTriggerRef
    } = useDropdown();

    const apolloClient = useApolloClient();
    const history = useHistory();
    const location = useLocation();
    const [revokeToken] = useMutation(signOutMutation);
    const [{ isSignedIn: isUserSignedIn }, { signOut }] = useUserContext();

    const handleSignOut = useCallback(async () => {
        setView(VIEWS.SIGNIN);
        setAccountMenuIsOpen(false);

        // Delete cart/user data from the redux store.
        await signOut({ revokeToken });
        await clearCartDataFromCache(apolloClient);
        await clearCustomerDataFromCache(apolloClient);

        // Refresh the page as a way to say "re-initialize". An alternative
        // would be to call apolloClient.resetStore() but that would require
        // a large refactor.
        history.go(0);
    }, [
        apolloClient,
        history,
        revokeToken,
        setAccountMenuIsOpen,
        signOut,
        VIEWS.SIGNIN
    ]);

    const handleTriggerClick = useCallback(() => {
        // Toggle the Account Menu.
        setAccountMenuIsOpen(isOpen => !isOpen);
        /**
         * When the dropdown closes, the view has to
         * reset to SINGIN view if the user is not
         * signed in.
         */
        if (!isUserSignedIn) {
            setView(VIEWS.SIGNIN);
        }
    }, [setAccountMenuIsOpen, isUserSignedIn, VIEWS]);

    const handleForgotPassword = useCallback(() => {
        setView(VIEWS.FORGOT_PASSWORD);
    }, [VIEWS.FORGOT_PASSWORD]);

    const handleCreateAccount = useCallback(() => {
        setView(VIEWS.CREATE_ACCOUNT);
    }, [VIEWS.CREATE_ACCOUNT]);

    // Close the Account Menu on page change.
    useEffect(() => {
        setAccountMenuIsOpen(false);
    }, [location.pathname, setAccountMenuIsOpen]);

    // Set view to account if the user is signed in and view is not ACCOUNT
    useEffect(() => {
        if (isUserSignedIn && view !== VIEWS.ACCOUNT) {
            setView(VIEWS.ACCOUNT);
        }
    }, [isUserSignedIn, VIEWS, view]);

    return {
        accountMenuIsOpen,
        accountMenuRef,
        accountMenuTriggerRef,
        handleSignOut,
        handleTriggerClick,
        isUserSignedIn,
        handleForgotPassword,
        handleCreateAccount,
        view,
        username,
        setUsername
    };
};
