import { useCallback, useMemo, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { useAppContext } from '../../context/app';
import { useUserContext } from '../../context/user';

export const useAccountInformationPage = props => {
    const {
        mutations: {
            setCustomerInformationMutation,
            changeCustomerPasswordMutation
        },
        queries: { getCustomerInformationQuery }
    } = props;

    const [, { toggleDrawer, closeDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();

    const [activeChangePassword, setActiveChangePassword] = useState(false);
    const [updatedData, setUpdatedData] = useState(false);

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

    const handleEditInformation = useCallback(() => {
        toggleDrawer('accountInformation.edit');
    }, [toggleDrawer]);

    const handleCloseDrawer = useCallback(() => {
        closeDrawer('accountInformation.edit');
    }, [closeDrawer]);

    const handleChangePassword = useCallback(
        status => {
            setActiveChangePassword(status);
        },
        [setActiveChangePassword]
    );

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

    useEffect(() => {
        if (
            updatedData &&
            (!setCustomerInformationError ||
                (activeChangePassword && !changeCustomerPasswordError))
        ) {
            handleCloseDrawer();
            setUpdatedData(false);
        }
    }, [
        updatedData,
        setCustomerInformationError,
        changeCustomerPasswordError,
        activeChangePassword,
        handleCloseDrawer
    ]);

    return {
        initialValues,
        loadDataError,
        isSignedIn,
        handleSubmit,
        handleEditInformation,
        activeChangePassword,
        handleChangePassword,
        isDisabled: isSubmittingInfo || isSubmittingPassword,
        formErrors: [setCustomerInformationError, changeCustomerPasswordError]
    };
};
