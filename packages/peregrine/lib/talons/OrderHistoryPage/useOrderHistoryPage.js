import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 *  A talon to support the functionality of the Order History page.
 *
 *  @returns {Object}   talonProps
 *  @returns {Object}   talonProps.data - The user's order history data.
 *  @returns {Boolean}  talonProps.isLoading - Indicates whether the user's
 *      order history data is loading.
 */
export const useOrderHistoryPage = () => {
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    // If the user is no longer signed in, redirect to the home page.
    useEffect(() => {
        if (!isSignedIn) {
            history.push('/');
        }
    }, [history, isSignedIn]);

    return {
        // TODO: make GraphQL calls to populate this data.
        data: null,
        isLoading: false
    };
};
