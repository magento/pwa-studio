import { useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './bankTransfer.gql';

export const useBankTransfer = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { getStoreConfig } = operations;

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
