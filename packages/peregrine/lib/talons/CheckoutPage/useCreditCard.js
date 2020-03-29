import { useCallback, useState } from 'react';

export const useCreditCard = () => {
    const [paymentNonce, setPaymentNonce] = useState();
    const onPaymentSuccess = useCallback(nonce => {
        console.log('Payment Nonce Received', nonce);
        setPaymentNonce(nonce);
    }, []);
    const onPaymentError = useCallback(error => {
        console.error(error);
    }, []);
    const onPaymentReady = useCallback(data => {
        console.log('payment Ready', data);
    }, []);

    return {
        paymentNonce,
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady
    };
};
