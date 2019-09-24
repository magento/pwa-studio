import { useCallback } from 'react';
import { useUserContext } from '../../context/user';

export const useAuthBar = props => {
    const { disabled, showMyAccount, showSignIn } = props;
    const [{ currentUser, isSignedIn }] = useUserContext();

    const handleClick = useCallback(() => {
        showSignIn();
    }, [showSignIn]);

    return {
        currentUser,
        disabled,
        handleClick,
        isSignedIn,
        showMyAccount
    };
};
