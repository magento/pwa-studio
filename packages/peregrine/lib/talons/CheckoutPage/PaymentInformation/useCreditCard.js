import { useCallback } from 'react';

export const useCreditCard = props => {
    const { onSuccess } = props;
    const onPaymentSuccess = useCallback(
        nonce => {
            console.log('Payment Nonce Received', nonce);
            onSuccess(nonce);
        },
        [onSuccess]
    );
    const onPaymentError = useCallback(error => {
        console.error(error);
    }, []);
    const onPaymentReady = useCallback(data => {
        console.log('payment Ready', data);
    }, []);

    return {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady
    };
};
