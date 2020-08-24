import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 *  A talon to support the functionality of the Address Book page.
 *
 *  @returns {Object}   talonProps
 *  @returns {Object}   talonProps.data - The user's address book data.
 *  @returns {Boolean}  talonProps.isLoading - Indicates whether the user's
 *      address book data is loading.
 */
export const useAddressBookPage = () => {
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    // TODO: these should be based on Apollo hooks results.
    const data = null;
    const isLoading = false;

    // If the user is no longer signed in, redirect to the home page.
    useEffect(() => {
        if (!isSignedIn) {
            history.push('/');
        }
    }, [history, isSignedIn]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isLoading);
    }, [isLoading, setPageLoading]);

    return {
        data
    };
};
