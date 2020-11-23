import { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './addressBookPage.gql';

/**
 *  A talon to support the functionality of the Address Book page.
 *
 *  @param {Object} props
 *  @param {Object} props.operations - GraphQL operations to be run by the talon.
 *
 *
 *  @returns {Object}   talonProps
 *  @returns {Object}   talonProps.data - The user's address book data.
 *  @returns {Boolean}  talonProps.isLoading - Indicates whether the user's
 *      address book data is loading.
 */
export const useAddressBookPage = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);
    const { getCustomerAddressesQuery } = operations;

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
            fetchPolicy: 'cache-and-network',
            skip: !isSignedIn
        }
    );

    const isRefetching = !!customerAddressesData && loading;
    const isLoadingWithoutData = !customerAddressesData && loading;

    // If the user is no longer signed in, redirect to the home page.
    useEffect(() => {
        if (!isSignedIn) {
            history.push('/');
        }
    }, [history, isSignedIn]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isRefetching);
    }, [isRefetching, setPageLoading]);

    const handleAddAddress = useCallback(() => {
        alert('TODO!');
    }, []);

    const customerAddresses =
        (customerAddressesData &&
            customerAddressesData.customer &&
            customerAddressesData.customer.addresses) ||
        [];

    // use data from backend until Intl.DisplayNames is widely supported
    const countryDisplayNameMap = useMemo(() => {
        const countryMap = new Map();

        if (customerAddressesData) {
            const { countries } = customerAddressesData;
            countries.forEach(country => {
                countryMap.set(country.id, country.full_name_locale);
            });
        }

        return countryMap;
    }, [customerAddressesData]);

    return {
        countryDisplayNameMap,
        customerAddresses,
        handleAddAddress,
        isLoading: isLoadingWithoutData
    };
};
