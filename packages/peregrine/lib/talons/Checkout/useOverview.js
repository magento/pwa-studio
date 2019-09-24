import { useCallback } from 'react';

export const useOverview = props => {
    const {
        cancelCheckout,
        cart,
        hasPaymentMethod,
        hasShippingAddress,
        hasShippingMethod,
        isSubmitting,
        paymentData,
        ready,
        setEditing,
        shippingAddress,
        shippingTitle,
        submitOrder
    } = props;

    const handleAddressFormClick = useCallback(() => {
        setEditing('address');
    }, [setEditing]);

    const handlePaymentFormClick = useCallback(() => {
        setEditing('paymentMethod');
    }, [setEditing]);

    const handleShippingFormClick = useCallback(() => {
        setEditing('shippingMethod');
    }, [setEditing]);

    const currencyCode =
        (cart && cart.totals && cart.totals.quote_currency_code) || 'USD';
    const numItems = (cart && cart.details && cart.details.items_qty) || 0;
    const subtotal = (cart && cart.totals && cart.totals.subtotal) || 0;

    return {
        cancelCheckout,
        currencyCode,
        handleAddressFormClick,
        handlePaymentFormClick,
        handleShippingFormClick,
        hasPaymentMethod,
        hasShippingAddress,
        hasShippingMethod,
        isSubmitting,
        numItems,
        paymentData,
        ready,
        shippingAddress,
        shippingTitle,
        submitOrder,
        subtotal
    };
};
