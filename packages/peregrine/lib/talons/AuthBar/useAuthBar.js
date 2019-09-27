import { useCallback } from 'react';
import { useUserContext } from '../../context/user';

/**
 * Returns props necessary to render an AuthBar component.
 *
 * @param {object} props
 * @param {boolean} props.disabled - whether sign in button should be disabled
 * @param {function} props.showMyAccount - callback that displays my account view
 * @param {function} props.showSignIn - callback that displays sign in view
 * @return {{
 *   currentUser: object,
 *   handleShowMyAccount: function,
 *   handleSignIn: function,
 *   isSignedIn: boolean,
 *   isSignInDisabled: boolean
 * }}
 */
export const useAuthBar = props => {
    const { disabled, showMyAccount, showSignIn } = props;
    const [{ currentUser, isSignedIn }] = useUserContext();

    const handleSignIn = useCallback(() => {
        showSignIn();
    }, [showSignIn]);

    const handleShowMyAccount = useCallback(() => {
        showMyAccount();
    }, [showMyAccount]);

    return {
        currentUser,
        handleShowMyAccount,
        handleSignIn,
        isSignedIn,
        isSignInDisabled: disabled
    };
};
