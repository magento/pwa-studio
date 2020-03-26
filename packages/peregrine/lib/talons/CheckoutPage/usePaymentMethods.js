import { useFieldState } from 'informed';

export const usePaymentMethods = () => {
    const { value: selectedPaymentMethod } = useFieldState('paymentMethods');

    return {
        selectedPaymentMethod
    };
};
