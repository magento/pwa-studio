import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './addressBookPage.gql';

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
export const useAddressBookPage = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);
    const {
        createCustomerAddressMutation,
        getCustomerAddressesQuery,
        updateCustomerAddressMutation
    } = operations;

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
    const [
        createCustomerAddress,
        {
            error: createCustomerAddressError,
            loading: isCreatingCustomerAddress
        }
    ] = useMutation(createCustomerAddressMutation);
    const [
        updateCustomerAddress,
        {
            error: updateCustomerAddressError,
            loading: isUpdatingCustomerAddress
        }
    ] = useMutation(updateCustomerAddressMutation);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeEditAddress, setActiveEditAddress] = useState();
    const isDialogEditMode = !!activeEditAddress;

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
        setActiveEditAddress(null);
        setIsDialogOpen(true);
    }, []);

    const handleEditAddress = useCallback(address => {
        setActiveEditAddress(address);
        setIsDialogOpen(true);
    }, []);

    const handleCancelDialog = useCallback(() => {
        setIsDialogOpen(false);
    }, []);

    const handleConfirmDialog = useCallback(
        async formValues => {
            if (isDialogEditMode) {
                try {
                    await updateCustomerAddress({
                        variables: { address: formValues },
                        refetchQueries: [{ query: getCustomerAddressesQuery }]
                    });

                    setIsDialogOpen(false);
                } catch {
                    return;
                }
            } else {
                try {
                    await createCustomerAddress({
                        variables: { address: formValues },
                        refetchQueries: [{ query: getCustomerAddressesQuery }]
                    });

                    setIsDialogOpen(false);
                } catch {
                    return;
                }
            }
        },
        [
            createCustomerAddress,
            getCustomerAddressesQuery,
            isDialogEditMode,
            updateCustomerAddress
        ]
    );

    const formErrors = useMemo(
        () =>
            new Map([
                ['createCustomerAddressMutation', createCustomerAddressError],
                ['updateCustomerAddressMutation', updateCustomerAddressError]
            ]),
        [createCustomerAddressError, updateCustomerAddressError]
    );

    const customerAddresses =
        (customerAddressesData &&
            customerAddressesData.customer &&
            customerAddressesData.customer.addresses) ||
        [];

    return {
        activeEditAddress,
        customerAddresses,
        formErrors,
        handleAddAddress,
        handleCancelDialog,
        handleConfirmDialog,
        handleEditAddress,
        isDialogEditMode,
        isDialogOpen
    };
};
