import { useCallback } from 'react';

/**
 * Returns props to render an Overview component.
 *
 * @param {Object} props.cart cart state object
 * @param {boolean} props.isSubmitting is the form already submitting
 * @param {boolean} props.ready is the form ready to submit
 * @param {function} props.setEditing set editing state object
 */
export const useOverview = props => {
    const {
        cancelCheckout,
        cart,
        isSubmitting,
        ready,
        setEditing,
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

    const handleCancel = useCallback(() => {
        cancelCheckout();
    }, [cancelCheckout]);

    const handleSubmit = useCallback(() => {
        submitOrder();
    }, [submitOrder]);

    const currencyCode =
        (cart && cart.totals && cart.totals.quote_currency_code) || 'USD';
    const numItems = (cart && cart.details && cart.details.items_qty) || 0;
    const subtotal = (cart && cart.totals && cart.totals.subtotal) || 0;

    return {
        currencyCode,
        handleAddressFormClick,
        handleCancel,
        handlePaymentFormClick,
        handleShippingFormClick,
        handleSubmit,
        isSubmitDisabled: isSubmitting || !ready,
        numItems,
        subtotal
    };
};
