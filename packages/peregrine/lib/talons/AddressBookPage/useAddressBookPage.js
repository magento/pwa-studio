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
 *  @function
 *
 *  @param {Object} props
 *  @param {Object} props.operations - GraphQL operations to be run by the talon.
 *
 *  @returns {AddressBookPageTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useAddressBookPage } from '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage';
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
    const isRefetching = !!customerAddressesData && loading;
    const customerAddresses =
        (customerAddressesData &&
            customerAddressesData.customer &&
            customerAddressesData.customer.addresses) ||
        [];

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
    const [isDialogEditMode, setIsDialogEditMode] = useState(false);
    const [formAddress, setFormAddress] = useState({});

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

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
        // Hide all previous errors when we open the dialog.
        setDisplayError(false);

        setIsDialogEditMode(false);
        setFormAddress({ country_code: 'US' });
        setIsDialogOpen(true);
    }, []);

    const handleEditAddress = useCallback(address => {
        // Hide all previous errors when we open the dialog.
        setDisplayError(false);

        setIsDialogEditMode(true);
        setFormAddress(address);
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
                        variables: {
                            addressId: formAddress.id,
                            updated_address: formValues
                        },
                        refetchQueries: [{ query: getCustomerAddressesQuery }],
                        awaitRefetchQueries: true
                    });

                    setIsDialogOpen(false);
                } catch {
                    // Make sure any errors from the mutations are displayed.
                    setDisplayError(true);

                    // we have an onError link that logs errors, and FormError
                    // already renders this error, so just return to avoid
                    // triggering the success callback
                    return;
                }
            } else {
                try {
                    await createCustomerAddress({
                        variables: { address: formValues },
                        refetchQueries: [{ query: getCustomerAddressesQuery }],
                        awaitRefetchQueries: true
                    });

                    setIsDialogOpen(false);
                } catch {
                    // Make sure any errors from the mutations are displayed.
                    setDisplayError(true);

                    // we have an onError link that logs errors, and FormError
                    // already renders this error, so just return to avoid
                    // triggering the success callback
                    return;
                }
            }
        },
        [
            createCustomerAddress,
            formAddress,
            getCustomerAddressesQuery,
            isDialogEditMode,
            updateCustomerAddress
        ]
    );

    const formErrors = useMemo(() => {
        if (displayError) {
            return new Map([
                ['createCustomerAddressMutation', createCustomerAddressError],
                ['updateCustomerAddressMutation', updateCustomerAddressError]
            ]);
        } else return new Map();
    }, [createCustomerAddressError, displayError, updateCustomerAddressError]);

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

    const isDialogBusy = isCreatingCustomerAddress || isUpdatingCustomerAddress;
    const isLoadingWithoutData = !customerAddressesData && loading;

    const formProps = {
        initialValues: formAddress
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
        isDialogBusy,
        isDialogEditMode,
        isDialogOpen,
        isLoading: isLoadingWithoutData
    };
};

/**
 * Object type returned by the {@link useAddressBookPage} talon.
 * It provides props data to use when rendering the address book page component.
 *
 * @typedef {Object} AddressBookPageTalonProps
 *
 * @property {Map} countryDisplayNameMap - A Map of country id to its localized display name.
 * @property {Array<Object>} customerAddresses - A list of customer addresses.
 * @property {Map} formErrors - A Map of form errors.
 * @property {Object} formProps - Properties to pass to the add/edit form.
 * @property {Function} handleAddAdddress - Function to invoke when adding a new address.
 * @property {Function} handleCancelDialog - Function to invoke when cancelling the add/edit dialog.
 * @property {Function} handleConfirmDialog - Function to invoke when submitting the add/edit dialog.
 * @property {Function} handleEditAddress - Function to invoke when editing an existing address.
 * @property {Boolean} isDialogBusy - Whether actions inside the dialog should be disabled.
 * @property {Boolean} isDialogEditMode - Whether the dialog is in edit mode (true) or add new mode (false).
 * @property {Boolean} isDialogOpen - Whether the dialog should be open.
 * @property {Boolean} isLoading - Whether the page is loading.
 */
