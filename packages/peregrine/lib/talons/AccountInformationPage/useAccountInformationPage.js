import { useCallback, useMemo, useState } from 'react';
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

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    const { data: accountInformationData, error: loadDataError } = useQuery(
        getCustomerInformationQuery,
        {
            skip: !isSignedIn,
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    const [
        setCustomerInformation,
        {
            data: customerInformationUpdateData,
            error: customerInformationUpdateError,
            loading: isUpdatingCustomerInformation
        }
    ] = useMutation(setCustomerInformationMutation);

    const [
        changeCustomerPassword,
        {
            error: customerPasswordChangeError,
            loading: isChangingCustomerPassword
        }
    ] = useMutation(changeCustomerPasswordMutation);

    const initialValues = useMemo(() => {
        if (customerInformationUpdateData) {
            return {
                customer: customerInformationUpdateData.updateCustomer.customer
            };
        }
        if (accountInformationData) {
            return { customer: accountInformationData.customer };
        }
    }, [customerInformationUpdateData, accountInformationData]);

    const cancelUpdateMode = useCallback(() => {
        setIsUpdateMode(false);
        setIsChangingPassword(false);
    }, [setIsUpdateMode]);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);
    }, [setIsUpdateMode]);

    const showChangePassword = useCallback(() => {
        setIsChangingPassword(true);
    }, [setIsChangingPassword]);

    const handleSubmit = useCallback(
        async formValues => {
            try {
                await setCustomerInformation({
                    variables: formValues
                });

                if (isChangingPassword) {
                    await changeCustomerPassword({
                        variables: {
                            currentPassword: formValues.password,
                            newPassword: formValues.newPassword
                        }
                    });
                }
                // After submission, close the form if there were no errors.
                cancelUpdateMode(false);
            } catch {
                // we have an onError link that logs errors, and FormError
                // already renders this error, so just return to avoid
                // triggering the success callback
                return;
            }
        },
        [
            setCustomerInformation,
            isChangingPassword,
            cancelUpdateMode,
            changeCustomerPassword
        ]
    );

    return {
        cancelUpdateMode,
        formErrors: [
            customerInformationUpdateError,
            customerPasswordChangeError
        ],
        handleSubmit,
        initialValues,
        isChangingPassword,
        isDisabled: isUpdatingCustomerInformation || isChangingCustomerPassword,
        isUpdateMode,
        isSignedIn,
        loadDataError,
        showUpdateMode,
        showChangePassword
    };
};
