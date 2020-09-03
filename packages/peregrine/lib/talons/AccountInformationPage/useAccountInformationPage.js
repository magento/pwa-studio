import { useCallback, useMemo, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useUserContext } from '../../context/user';

export const useAccountInformationPage = props => {
    const {
        mutations: {
            setCustomerInformationMutation,
            changeCustomerPasswordMutation
        },
        queries: { getCustomerInformationQuery }
    } = props;

    const [{ isSignedIn }] = useUserContext();

    const [activeChangePassword, setActiveChangePassword] = useState(false);
    const [updatedData, setUpdatedData] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    const { data: accountInformationData, error: loadDataError } = useQuery(
        getCustomerInformationQuery,
        { skip: !isSignedIn, fetchPolicy: 'cache-and-network' }
    );

    const [
        setCustomerInformation,
        {
            data: customerInformationUpdated,
            error: setCustomerInformationError,
            loading: isSubmittingInfo
        }
    ] = useMutation(setCustomerInformationMutation);

    const [
        changeCustomerPassword,
        { error: changeCustomerPasswordError, loading: isSubmittingPassword }
    ] = useMutation(changeCustomerPasswordMutation);

    const initialValues = useMemo(() => {
        if (customerInformationUpdated) {
            return {
                customer: customerInformationUpdated.updateCustomer.customer
            };
        }
        if (accountInformationData) {
            return { customer: accountInformationData.customer };
        }
    }, [customerInformationUpdated, accountInformationData]);

    const handleActivePassword = useCallback(() => {
        setActiveChangePassword(true);
    }, [setActiveChangePassword]);

    const handleDeActivePassword = useCallback(() => {
        setActiveChangePassword(false);
    }, [setActiveChangePassword]);

    const handleSubmit = useCallback(
        async formValues => {
            try {
                await setCustomerInformation({
                    variables: formValues
                });

                if (activeChangePassword) {
                    await changeCustomerPassword({
                        variables: {
                            currentPassword: formValues.password,
                            newPassword: formValues.newPassword
                        }
                    });
                }
                setUpdatedData(true);
            } catch {
                // we have an onError link that logs errors, and FormError already renders this error, so just return
                // to avoid triggering the success callback
                return;
            }
        },
        [setCustomerInformation, changeCustomerPassword, activeChangePassword]
    );

    const handleCancelUpdate = useCallback(() => {
        setIsUpdateMode(false);
        handleDeActivePassword();
    }, [setIsUpdateMode, handleDeActivePassword]);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);
    }, [setIsUpdateMode]);

    useEffect(() => {
        if (
            updatedData &&
            (!setCustomerInformationError ||
                (activeChangePassword && !changeCustomerPasswordError))
        ) {
            handleCancelUpdate();
            setUpdatedData(false);
        }
    }, [
        updatedData,
        setCustomerInformationError,
        changeCustomerPasswordError,
        activeChangePassword,
        handleCancelUpdate
    ]);

    return {
        initialValues,
        loadDataError,
        isSignedIn,
        handleSubmit,
        activeChangePassword,
        handleActivePassword,
        isDisabled: isSubmittingInfo || isSubmittingPassword,
        formErrors: [setCustomerInformationError, changeCustomerPasswordError],
        isUpdateMode,
        handleCancelUpdate,
        showUpdateMode
    };
};
