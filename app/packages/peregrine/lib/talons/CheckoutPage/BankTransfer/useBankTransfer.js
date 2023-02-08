import { useEffect, useCallback } from 'react';
import { useStoreConfigContext } from '../../../context/storeConfigProvider';

export const useBankTransfer = props => {
    const { onPaymentSuccess, resetShouldSubmit, onPaymentError, paymentMethodMutationData } = props;
    const paymentMethodMutationLoading = paymentMethodMutationData?.paymentMethodMutationLoading;
    const paymentMethodMutationError = paymentMethodMutationData?.paymentMethodMutationError;
    const paymentMethodMutationCalled = paymentMethodMutationData?.paymentMethodMutationCalled;

    // Getting Extra Information
    const storeConfigData = useStoreConfigContext();

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
        loading: storeConfigData === undefined,
        extraInfo: storeConfigData,
        handleSubmitBtn,
        onBillingAddressChangedError
    };
};
