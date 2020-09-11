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

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [updatedData, setUpdatedData] = useState(false);
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

    const handleChangePassword = useCallback(() => {
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
                setUpdatedData(true);
            } catch {
                // we have an onError link that logs errors, and FormError
                // already renders this error, so just return to avoid
                // triggering the success callback
                return;
            }
        },
        [setCustomerInformation, changeCustomerPassword, isChangingPassword]
    );

    const handleCancelUpdate = useCallback(() => {
        setIsUpdateMode(false);
        setIsChangingPassword(false);
    }, [setIsUpdateMode, setIsChangingPassword]);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);
    }, [setIsUpdateMode]);

    useEffect(() => {
        if (
            updatedData &&
            (!customerInformationUpdateError ||
                (isChangingPassword && !customerPasswordChangeError))
        ) {
            handleCancelUpdate();
            setUpdatedData(false);
        }
    }, [
        updatedData,
        customerInformationUpdateError,
        customerPasswordChangeError,
        isChangingPassword,
        handleCancelUpdate
    ]);

    return {
        initialValues,
        loadDataError,
        isSignedIn,
        handleSubmit,
        isChangingPassword,
        handleChangePassword,
        isDisabled: isUpdatingCustomerInformation || isChangingCustomerPassword,
        formErrors: [
            customerInformationUpdateError,
            customerPasswordChangeError
        ],
        isUpdateMode,
        handleCancelUpdate,
        showUpdateMode
    };
};
