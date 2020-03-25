

import { useFieldState } from 'informed';

const usePaymentInformation = () => {
    const selectedPaymentMethod = useFieldState('testradiobuttons');

    return {
        selectedPaymentMethod
    };
};

export default usePaymentInformation;
