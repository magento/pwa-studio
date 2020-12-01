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
    const [{ isSignedIn }] = useUserContext();
    const history = useHistory();
    const { data: customerAddressesData, loading } = useQuery(
        getCustomerAddressesQuery,
        {
            fetchPolicy: 'cache-and-network',
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

    const [formApi, setFormApi] = useState();

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
        setActiveEditAddress(null);
        setIsDialogOpen(true);
    }, []);

    const handleEditAddress = useCallback(
        address => {
            formApi.setValues(address);
            setActiveEditAddress(address);
            setIsDialogOpen(true);
        },
        [formApi]
    );

    const handleCancelDialog = useCallback(() => {
        setIsDialogOpen(false);
    }, []);

    const handleConfirmDialog = useCallback(
        async formValues => {
            if (isDialogEditMode) {
                try {
                    await updateCustomerAddress({
                        variables: {
                            addressId: activeEditAddress.id,
                            updated_address: formValues
                        },
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
            activeEditAddress,
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

    const customerAddresses =
        (customerAddressesData &&
            customerAddressesData.customer &&
            customerAddressesData.customer.addresses) ||
        [];

    // Used to seed the form when adding a new address.
    // Needed for the Region component to work properly.
    const initialValues = {
        country_code: 'US'
    };
    const formProps = {
        getApi: setFormApi,
        initialValues
    };

    return {
        countryDisplayNameMap,
        customerAddresses,
        formErrors,
        formProps,
        handleAddAddress,
        handleCancelDialog,
        handleConfirmDialog,
        handleEditAddress,
        isDialogEditMode,
        isDialogOpen,
        isLoading: isLoadingWithoutData
    };
};
