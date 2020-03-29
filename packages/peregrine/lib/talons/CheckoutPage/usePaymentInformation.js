import { useState, useCallback } from 'react';

export const usePaymentInformation = props => {
    const { onSave } = props;
    const [doneEditing, setDoneEditing] = useState(false);
    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );
    const handleReviewOrder = useCallback(() => {
        setDoneEditing(true);
        setShouldRequestPaymentNonce(true);
        onSave();
    }, [onSave]);

    return {
        doneEditing,
        handleReviewOrder,
        shouldRequestPaymentNonce
    };
};
