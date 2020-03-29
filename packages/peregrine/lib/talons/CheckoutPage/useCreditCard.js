import { useCallback } from 'react';

const useCreditCard = () => {
    const onPaymentSuccess = useCallback(() => {}, []);
    const onPaymentError = useCallback(() => {}, []);
    const onPaymentReady = useCallback(() => {}, []);

    return {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady
    };
};

export default useCreditCard;
