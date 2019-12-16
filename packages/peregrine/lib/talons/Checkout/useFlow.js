import { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

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
    const { createCartMutation, onSubmitError, setStep } = props;
    const [fetchCartId] = useMutation(createCartMutation);
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

    const handleBeginCheckout = useCallback(async () => {
        await beginCheckout({
            fetchCartId
        });
        setStep('form');
    }, [beginCheckout, fetchCartId, setStep]);

    const handleCancelCheckout = useCallback(async () => {
        await cancelCheckout();
        setStep('cart');
    }, [cancelCheckout, setStep]);

    const handleSubmitOrder = useCallback(async () => {
        try {
            await submitOrder({
                fetchCartId
            });
            setStep('receipt');
        } catch (e) {
            onSubmitError(e);
        }
    }, [fetchCartId, onSubmitError, setStep, submitOrder]);

    const handleCloseReceipt = useCallback(() => {
        setStep('cart');
    }, [setStep]);

    return {
        cartState,
        checkoutDisabled: checkoutState.isSubmitting || cartState.isEmpty,
        checkoutState,
        isReady: isCheckoutReady(checkoutState),
        submitPaymentMethodAndBillingAddress,
        submitShippingAddress,
        submitShippingMethod,
        handleBeginCheckout,
        handleCancelCheckout,
        handleCloseReceipt,
        handleSubmitOrder
    };
};
