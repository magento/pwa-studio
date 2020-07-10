import { useState, useCallback } from 'react';

export const useItem = props => {
    const { id, closeMiniCart, handleRemoveItem } = props;

    const [isDeleting, setIsDeleting] = useState(false);

    const removeItem = useCallback(() => {
        setIsDeleting(true);
        handleRemoveItem(id);
    }, [handleRemoveItem, id]);

    const handleItemClick = useCallback(() => {
        closeMiniCart();
    }, [closeMiniCart]);

    return {
        isDeleting,
        removeItem,
        handleItemClick
    };
};
