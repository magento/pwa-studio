import { useCallback, useState } from 'react';

export const useCreditCard = props => {
    const { setDoneEditing } = props;
    const [paymentNonce, setPaymentNonce] = useState();
    const onPaymentSuccess = useCallback(
        nonce => {
            console.log('Payment Nonce Received', nonce);
            setPaymentNonce(nonce);
            setDoneEditing(true);
        },
        [setDoneEditing]
    );
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
