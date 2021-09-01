import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * A hook that will redirect the user if not signed in.
 */
export const useAuthorizedComponent = () => {
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    useEffect(() => {
        if (!isSignedIn) {
            history.push('/');
        }
    }, [history, isSignedIn]);
};
