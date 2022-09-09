import { useCallback, useMemo, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useGoogleReCaptcha } from '@magento/peregrine/lib/hooks/useGoogleReCaptcha/useGoogleReCaptcha';
import modifyCustomer from '@orienteed/csr/services/users/modifyCustomer';

import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useAccountInformationPage = props => {
    const {
        mutations: {
            setCustomerInformationMutation,
            changeCustomerPasswordMutation,
            createCustomerAddressMutation,
            deleteCustomerAddressMutation,
            updateCustomerAddressMutation
        },
        queries: { getCustomerInformationQuery, getCustomerAddressesQuery }
    } = props;

    const [{ isSignedIn }] = useUserContext();
    const [shouldShowNewPassword, setShouldShowNewPassword] = useState(false);
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const { data: accountInformationData, error: loadDataError } = useQuery(getCustomerInformationQuery, {
        skip: !isSignedIn,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [isUpdateMode, setIsUpdateMode] = useState(false);

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

    const { data: customerAddressesData, loading } = useQuery(getCustomerAddressesQuery, {
        fetchPolicy: 'cache-and-network',
        skip: !isSignedIn
    });

    const [
        setCustomerInformation,
        { error: customerInformationUpdateError, loading: isUpdatingCustomerInformation }
    ] = useMutation(setCustomerInformationMutation);

    const [
        changeCustomerPassword,
        { error: customerPasswordChangeError, loading: isChangingCustomerPassword }
    ] = useMutation(changeCustomerPasswordMutation);

    const [deleteCustomerAddress, { loading: isDeletingCustomerAddress }] = useMutation(deleteCustomerAddressMutation);

    const [confirmDeleteAddressId, setConfirmDeleteAddressId] = useState();

    const { generateReCaptchaData, recaptchaLoading, recaptchaWidgetProps } = useGoogleReCaptcha({
        currentForm: 'CUSTOMER_EDIT',
        formAction: 'editCustomer'
    });

    const initialValues = useMemo(() => {
        if (accountInformationData) {
            return { customer: accountInformationData.customer };
        }
    }, [accountInformationData]);

    const isRefetching = !!customerAddressesData && loading;
    const customerAddresses =
        (customerAddressesData && customerAddressesData.customer && customerAddressesData.customer.addresses) || [];

    const [
        createCustomerAddress,
        { error: createCustomerAddressError, loading: isCreatingCustomerAddress }
    ] = useMutation(createCustomerAddressMutation);
    const [
        updateCustomerAddress,
        { error: updateCustomerAddressError, loading: isUpdatingCustomerAddress }
    ] = useMutation(updateCustomerAddressMutation);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogEditMode, setIsDialogEditMode] = useState(false);
    const [formAddress, setFormAddress] = useState({});

    const handleChangePassword = useCallback(() => {
        setShouldShowNewPassword(true);
    }, [setShouldShowNewPassword]);

    const handleCancel = useCallback(() => {
        setIsUpdateMode(false);
        setShouldShowNewPassword(false);
    }, [setIsUpdateMode]);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);

        // If there were errors from removing/updating info, hide them
        // when we open the modal.
        setDisplayError(false);
    }, [setIsUpdateMode]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isRefetching);
    }, [isRefetching, setPageLoading]);

    const handleAddAddress = useCallback(() => {
        // Hide all previous errors when we open the dialog.
        setDisplayError(false);

        setIsDialogEditMode(false);
        setFormAddress({ country_code: DEFAULT_COUNTRY_CODE });
        setIsDialogOpen(true);
    }, []);

    const handleDeleteAddress = useCallback(addressId => {
        setConfirmDeleteAddressId(addressId);
    }, []);

    const handleCancelDeleteAddress = useCallback(() => {
        setConfirmDeleteAddressId(null);
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

    const handleConfirmDeleteAddress = useCallback(async () => {
        try {
            await deleteCustomerAddress({
                variables: { addressId: confirmDeleteAddressId },
                refetchQueries: [{ query: getCustomerAddressesQuery }],
                awaitRefetchQueries: true
            });

            setConfirmDeleteAddressId(null);
        } catch {
            return;
        }
    }, [confirmDeleteAddressId, deleteCustomerAddress, getCustomerAddressesQuery]);

    const handleSubmit = useCallback(
        async ({ email, firstname, taxvat, password, newPassword }) => {
            try {
                taxvat = taxvat.trim();
                email = email.trim();
                firstname = firstname.trim();
                password = password.trim();
                newPassword = newPassword ? newPassword.trim() : newPassword;

                if (
                    initialValues.customer.email !== email ||
                    initialValues.customer.firstname !== firstname ||
                    initialValues.customer.taxvat !== taxvat
                ) {
                    await setCustomerInformation({
                        variables: {
                            customerInput: {
                                email,
                                firstname,
                                taxvat,
                                // You must send password because it is required
                                // when changing email.
                                password
                            }
                        }
                    });
                    modifyCustomer(firstname, '', email);
                }
                if (password && newPassword) {
                    const recaptchaDataForChangeCustomerPassword = await generateReCaptchaData();
                    await changeCustomerPassword({
                        variables: {
                            currentPassword: password,
                            newPassword: newPassword
                        },
                        ...recaptchaDataForChangeCustomerPassword
                    });
                }
                // After submission, close the form if there were no errors.
                handleCancel(false);
            } catch {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);

                // we have an onError link that logs errors, and FormError
                // already renders this error, so just return to avoid
                // triggering the success callback
                return;
            }
        },
        [initialValues, handleCancel, setCustomerInformation, generateReCaptchaData, changeCustomerPassword]
    );
    const handleConfirmDialog = useCallback(
        async formValues => {
            if (isDialogEditMode) {
                try {
                    await updateCustomerAddress({
                        variables: {
                            addressId: formAddress.id,
                            updated_address: {
                                ...formValues,
                                // Sends value as empty if none are provided
                                middlename: formValues.middlename || '',
                                // Cleans up the street array when values are null or undefined
                                street: formValues.street.filter(e => e),
                                default_billing: true
                            }
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
                        variables: {
                            address: {
                                ...formValues,
                                // Sends value as empty if none are provided
                                middlename: formValues.middlename || '',
                                // Cleans up the street array when values are null or undefined
                                street: formValues.street.filter(e => e),
                                default_billing: true
                            }
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
            }
        },
        [createCustomerAddress, formAddress, getCustomerAddressesQuery, isDialogEditMode, updateCustomerAddress]
    );

    const formErrorsCustomerAddress = useMemo(() => {
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

    const errors = displayError ? [customerInformationUpdateError, customerPasswordChangeError] : [];

    return {
        handleCancel,
        formErrors: errors,
        handleSubmit,
        handleChangePassword,
        initialValues,
        isDisabled: isUpdatingCustomerInformation || isChangingCustomerPassword || recaptchaLoading,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        showUpdateMode,
        recaptchaWidgetProps,
        confirmDeleteAddressId,
        countryDisplayNameMap,
        customerAddresses,
        formErrorsCustomerAddress,
        formProps,
        handleAddAddress,
        handleCancelDeleteAddress,
        handleCancelDialog,
        handleConfirmDeleteAddress,
        handleConfirmDialog,
        handleDeleteAddress,
        handleEditAddress,
        isDeletingCustomerAddress,
        isDialogBusy,
        isDialogEditMode,
        isDialogOpen,
        isLoading: isLoadingWithoutData
    };
};
