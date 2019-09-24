import { useCallback } from 'react';

export const useEditableForm = props => {
    const {
        editing,
        isSubmitting,
        setEditing,
        shippingAddressError,
        submitPaymentMethodAndBillingAddress,
        submitShippingAddress,
        submitShippingMethod,
        checkout: { countries }
    } = props;

    const handleCancel = useCallback(() => {
        setEditing(null);
    }, [setEditing]);

    const handleSubmitAddressForm = useCallback(
        async formValues => {
            await submitShippingAddress({
                formValues
            });
            setEditing(null);
        },
        [setEditing, submitShippingAddress]
    );

    const handleSubmitPaymentsForm = useCallback(
        async formValues => {
            await submitPaymentMethodAndBillingAddress({
                formValues
            });
            setEditing(null);
        },
        [setEditing, submitPaymentMethodAndBillingAddress]
    );

    const handleSubmitShippingForm = useCallback(
        async formValues => {
            await submitShippingMethod({
                formValues
            });
            setEditing(null);
        },
        [setEditing, submitShippingMethod]
    );

    return {
        countries,
        editing,
        handleCancel,
        handleSubmitAddressForm,
        handleSubmitPaymentsForm,
        handleSubmitShippingForm,
        isSubmitting,
        shippingAddressError
    };
};
