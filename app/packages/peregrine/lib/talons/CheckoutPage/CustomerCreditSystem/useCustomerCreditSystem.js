import React, { useEffect, useState, useCallback } from 'react';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import Icon from '@magento/venia-ui/lib/components/Icon';

import { useQuery } from '@apollo/client';
import { useToasts } from '@magento/peregrine/lib/Toasts/useToasts';

import { GET_PAYMENT_CREDIT_SYSTEM_CONFIG } from './customerCreditSystem.gql';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

export const useCustomerCreditSystem = props => {
    const { formatMessage } = useIntl();

    const { onPaymentSuccess, resetShouldSubmit, shouldSubmit, onPaymentError, paymentMethodMutationData } = props;

    const [, { addToast }] = useToasts();

    const [checkoutData, setCheckoutData] = useState({});

    const paymentMethodMutationLoading = paymentMethodMutationData?.paymentMethodMutationLoading;
    const paymentMethodMutationError = paymentMethodMutationData?.paymentMethodMutationError;
    const paymentMethodMutationCalled = paymentMethodMutationData?.paymentMethodMutationCalled;

    // Get config details
    const { data, loading } = useQuery(GET_PAYMENT_CREDIT_SYSTEM_CONFIG, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    useEffect(() => {
        if (data != undefined) {
            const { WebkulPaymentCreditsystemConfig } = data;
            setCheckoutData(WebkulPaymentCreditsystemConfig);
        }
    }, [data]);

    // Handle Review Btn
    useEffect(() => {
        if (shouldSubmit) {
            const { remainingcreditcurrentcurrency, grand_total } = checkoutData;

            if (parseFloat(remainingcreditcurrentcurrency) < grand_total) {
                const message = formatMessage({
                    id: 'checkoutPage.customerCreditSystem.errorSubmit',
                    defaultMessage: 'Order Amount Is Greater Than The Credit Amount'
                });

                addToast({
                    type: 'error',
                    icon: errorIcon,
                    message,
                    dismissable: true,
                    timeout: 7000
                });
                resetShouldSubmit();
            }
        }
    }, [checkoutData, shouldSubmit, resetShouldSubmit, formatMessage, addToast]);

    useEffect(() => {
        const paymentMethodMutationCompleted = paymentMethodMutationCalled && !paymentMethodMutationLoading;
        if (paymentMethodMutationCompleted && !paymentMethodMutationError) {
            onPaymentSuccess();
        }

        if (paymentMethodMutationCompleted && paymentMethodMutationError) {
            onPaymentError();
        }
    }, [
        paymentMethodMutationError,
        paymentMethodMutationLoading,
        paymentMethodMutationCalled,
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit
    ]);

    /**
     * This function will be called if cant not set address.
     */
    const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit();
    }, [resetShouldSubmit]);

    /** Handle Submit Btn */
    const handleSubmitBtn = useCallback(() => {
        onPaymentSuccess();
    }, [onPaymentSuccess]);

    return {
        loading,
        checkoutData,
        handleSubmitBtn,
        onBillingAddressChangedError
    };
};
