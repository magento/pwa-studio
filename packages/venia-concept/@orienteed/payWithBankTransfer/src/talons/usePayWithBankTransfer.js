import React, { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from '@orienteed/payWithBankTransfer/src/query/payWithBankTransfer.gql';

export const usePayWithBankTransfer = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { setPaymentMethodOnCartMutation, getStoreConfig } = operations;

    const [{ cartId }] = useCartContext();

    const { onPaymentSuccess, resetShouldSubmit, onPaymentError, paymentMethodMutationData } = props;
    const paymentMethodMutationLoading = paymentMethodMutationData?.paymentMethodMutationLoading;
    const paymentMethodMutationError = paymentMethodMutationData?.paymentMethodMutationError;
    const paymentMethodMutationCalled = paymentMethodMutationData?.paymentMethodMutationCalled;



    // Getting Extra Information
    const { data: extraInfo, loading } = useQuery(getStoreConfig, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    /**
     * This function will be called if cant not set address.
     */
    const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit();
    }, [resetShouldSubmit]);

    /**
     * This function will be called if address was successfully set.
     */

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

    /** Handle Submit Btn */
    const handleSubmitBtn = useCallback(() => {
        onPaymentSuccess();
    }, [onPaymentSuccess]);

    return {
        loading,
        extraInfo,
        handleSubmitBtn,
        onBillingAddressChangedError
    };
};
