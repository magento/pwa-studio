import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 *  A talon to support the functionality of the Address Book page.
 *
 *  @param {Object} props
 *  @param {Object} props.queries - GraphQL queries to be run by the talon.
 *
 *
 *  @returns {Object}   talonProps
 *  @returns {Object}   talonProps.data - The user's address book data.
 *  @returns {Boolean}  talonProps.isLoading - Indicates whether the user's
 *      address book data is loading.
 */
export const useAddressBookPage = props => {
    const {
        queries: { getCustomerAddressesQuery }
    } = props;

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();
    const { data: customerAddressesData, loading } = useQuery(
        getCustomerAddressesQuery,
        {
            skip: !isSignedIn
        }
    );

    // If the user is no longer signed in, redirect to the home page.
    useEffect(() => {
        if (!isSignedIn) {
            history.push('/');
        }
    }, [history, isSignedIn]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(loading);
    }, [loading, setPageLoading]);

    const handleAddAddress = useCallback(() => {
        alert('TODO!');
    }, []);

    const customerAddresses =
        (customerAddressesData &&
            customerAddressesData.customer &&
            customerAddressesData.customer.addresses) ||
        [];

    return {
        customerAddresses,
        handleAddAddress
    };
};
