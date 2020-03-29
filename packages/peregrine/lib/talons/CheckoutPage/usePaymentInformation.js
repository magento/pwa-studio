import { useState, useCallback } from 'react';

export const usePaymentInformation = props => {
    const { onSave } = props;
    const [doneEditing, setDoneEditing] = useState(false);
    const handleReviewOrder = useCallback(() => {
        setDoneEditing(true);
        // payment nonce request
        onSave();
    }, [onSave]);

    return {
        doneEditing,
        handleReviewOrder
    };
};
