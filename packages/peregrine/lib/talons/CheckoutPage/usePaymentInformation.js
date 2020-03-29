import { useState, useCallback } from 'react';

export const usePaymentInformation = props => {
    const { onSave } = props;
    const [doneEditing, setDoneEditing] = useState(false);
    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );
    const [paymentNonce, setPaymentNonce] = useState(null);
    const handleReviewOrder = useCallback(() => {
        // setDoneEditing(true); // TODO, this should move to payment on success
        setShouldRequestPaymentNonce(true);
        onSave();
    }, [onSave]);
    const onPaymentSuccess = useCallback(
        paymentNonce => {
            setPaymentNonce(paymentNonce);
            setDoneEditing(true);
        },
        [setDoneEditing]
    );

    return {
        doneEditing,
        handleReviewOrder,
        shouldRequestPaymentNonce,
        onPaymentSuccess,
        paymentNonce
    };
};
