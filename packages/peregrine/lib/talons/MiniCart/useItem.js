import { useState, useCallback } from 'react';

export const useItem = props => {
    const { uid, handleRemoveItem } = props;

    const [isDeleting, setIsDeleting] = useState(false);

    const removeItem = useCallback(() => {
        setIsDeleting(true);
        handleRemoveItem(uid);
    }, [handleRemoveItem, uid]);

    return {
        isDeleting,
        removeItem
    };
};
