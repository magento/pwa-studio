import React, { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PAYMENT_CREDIT_SYSTEM_CONFIG } from '@orienteed/customerCreditSystem/src/query/customerCreditSystem.gql';
import { useToasts } from '@magento/peregrine';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { useIntl } from 'react-intl';
import DEFAULT_OPERATIONS from '@orienteed/customerCreditSystem/src/query/customerCreditSystem.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

export const useCustomerCreditSystem = props => {
    const { formatMessage } = useIntl();

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { setPaymentMethodOnCartMutation } = operations;

    console.log('operations');
    console.log(operations);

    const [{ cartId }] = useCartContext();

    const { onPaymentSuccess, resetShouldSubmit, shouldSubmit, onPaymentError } = props;

    const [, { addToast }] = useToasts();

    const [checkoutData, setCheckoutData] = useState({});

    const [
        updatePaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(setPaymentMethodOnCartMutation);

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
    }, [checkoutData, shouldSubmit, resetShouldSubmit]);

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

    /**
     * This function will be called if address was successfully set.
     */
    const onBillingAddressChangedSuccess = useCallback(() => {
        updatePaymentMethod({
            variables: { cartId }
        });
    }, [updatePaymentMethod, cartId]);

    /** Handle Submit Btn */
    const handleSubmitBtn = useCallback(() => {
        onPaymentSuccess();
    }, [onPaymentSuccess]);

    return {
        loading,
        checkoutData,
        handleSubmitBtn,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    };
};
