import { useCallback } from 'react';

export const useEditableForm = props => {
    const {
        countries,
        setEditing,
        submitPaymentMethodAndBillingAddress,
        submitShippingMethod
    } = props;

    const handleCancel = useCallback(() => {
        setEditing(null);
    }, [setEditing]);

    const handleSubmitAddressForm = useCallback(() => {
        setEditing(null);
    }, [setEditing]);

    const handleSubmitPaymentsForm = useCallback(
        async formValues => {
            await submitPaymentMethodAndBillingAddress({
                countries,
                formValues
            });
            setEditing(null);
        },
        [countries, setEditing, submitPaymentMethodAndBillingAddress]
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
        handleCancel,
        handleSubmitAddressForm,
        handleSubmitPaymentsForm,
        handleSubmitShippingForm
    };
};
