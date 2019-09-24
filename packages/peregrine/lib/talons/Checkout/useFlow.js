import { useCallback } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useCheckoutContext } from '@magento/peregrine/lib/context/checkout';
import isObjectEmpty from '../../util/isObjectEmpty';

const isCheckoutReady = checkout => {
    const {
        billingAddress,
        paymentData,
        shippingAddress,
        shippingMethod
    } = checkout;

    const objectsHaveData = [
        billingAddress,
        paymentData,
        shippingAddress
    ].every(data => {
        return !!data && !isObjectEmpty(data);
    });

    const stringsHaveData = !!shippingMethod && shippingMethod.length > 0;

    return objectsHaveData && stringsHaveData;
};

export const useFlow = props => {
    const [cartState] = useCartContext();
    const [
        checkoutState,
        {
            beginCheckout,
            cancelCheckout,
            submitOrder,
            submitPaymentMethodAndBillingAddress,
            submitShippingAddress,
            submitShippingMethod
        }
    ] = useCheckoutContext();
    const { onSubmitError, step, setStep } = props;

    const {
        availableShippingMethods,
        billingAddress,
        isSubmitting,
        paymentData,
        shippingAddress,
        shippingAddressError,
        shippingMethod,
        shippingTitle
    } = checkoutState;

    const handleBeginCheckout = useCallback(async () => {
        await beginCheckout();
        setStep('form');
    }, [beginCheckout, setStep]);

    const handleCancelCheckout = useCallback(async () => {
        await cancelCheckout();
        setStep('cart');
    }, [cancelCheckout, setStep]);

    const handleSubmitOrder = useCallback(async () => {
        try {
            await submitOrder();
            setStep('receipt');
        } catch (e) {
            onSubmitError(e);
        }
    }, [onSubmitError, setStep, submitOrder]);

    const handleCloseReceipt = useCallback(() => {
        setStep('cart');
    }, [setStep]);

    return {
        availableShippingMethods,
        billingAddress,
        cartState,
        checkoutDisabled: isSubmitting || cartState.isEmpty,
        checkoutState,
        isReady: isCheckoutReady(checkoutState),
        isSubmitting,
        paymentData,
        shippingAddress,
        shippingAddressError,
        shippingMethod,
        shippingTitle,
        submitPaymentMethodAndBillingAddress,
        submitShippingAddress,
        submitShippingMethod,
        handleBeginCheckout,
        handleCancelCheckout,
        handleCloseReceipt,
        handleSubmitOrder,
        step
    };
};
