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
 *   handleShowMyAccount: function,
 *   handleSignIn: function,
 *   isDisabled: boolean
 *   isUserSignedIn: boolean
 * }}
 */
export const useAuthBar = props => {
    const { disabled, showMyAccount, showSignIn } = props;
    const [{ isSignedIn: isUserSignedIn }] = useUserContext();

    const handleSignIn = useCallback(() => {
        showSignIn();
    }, [showSignIn]);

    const handleShowMyAccount = useCallback(() => {
        showMyAccount();
    }, [showMyAccount]);

    return {
        handleShowMyAccount,
        handleSignIn,
        isDisabled: disabled,
        isUserSignedIn
    };
};
