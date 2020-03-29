import { useEffect } from 'react';
import { useFieldState, useFormApi } from 'informed';

export const usePaymentMethods = props => {
    const { selectedPaymentMethod, setSelectedPaymentMethod } = props;

    const { value: selectedOption } = useFieldState('paymentMethods');

    const formApi = useFormApi();

    useEffect(() => {
        if (selectedOption && selectedPaymentMethod !== selectedOption) {
            setSelectedPaymentMethod(selectedOption);
        }
    }, [setSelectedPaymentMethod, selectedPaymentMethod, selectedOption]);

    useEffect(() => {
        if (!selectedOption && selectedPaymentMethod !== selectedOption) {
            formApi.setValue('paymentMethods', selectedPaymentMethod);
        }
    });
};
