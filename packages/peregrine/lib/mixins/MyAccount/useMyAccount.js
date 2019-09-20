import { useCallback } from 'react';
import { useUserContext } from '../../context/user';

const DEFAULT_TITLE = 'My Account';
const UNAUTHED_TITLE = 'Signing Out';
const UNAUTHED_SUBTITLE = 'Please wait...';

const useMyAccount = props => {
    const { signOut } = props;
    const [{ currentUser }] = useUserContext();
    const { email, firstname, lastname } = currentUser;
    const name = `${firstname} ${lastname}`.trim() || DEFAULT_TITLE;
    const title = email ? name : UNAUTHED_TITLE;
    const subtitle = email ? email : UNAUTHED_SUBTITLE;

    const handleSignOut = useCallback(() => {
        signOut({ history: window.history });
    }, [signOut]);

    return {
        handleSignOut,
        subtitle,
        title
    };
};

export default useMyAccount;
