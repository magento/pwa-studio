import { useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

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
            setCountries,
            submitOrder,
            submitPaymentMethodAndBillingAddress,
            submitShippingAddress,
            submitShippingMethod
        }
    ] = useCheckoutContext();
    const { countriesQuery, onSubmitError, setStep } = props;

    const [runQuery, queryResponse] = useLazyQuery(countriesQuery);
    const getCountries = runQuery;
    const { data: countriesData } = queryResponse;

    const handleBeginCheckout = useCallback(async () => {
        getCountries();
        await beginCheckout();

        setStep('form');
    }, [beginCheckout, getCountries, setStep]);

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

    useEffect(() => {
        if (countriesData) {
            setCountries(countriesData.countries);
        }
    }, [countriesData, setCountries]);

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
