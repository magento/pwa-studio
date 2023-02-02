import { useCallback, useState } from 'react';

export const useWishlistItems = () => {
    const [activeAddToCartItem, setActiveAddToCartItem] = useState(null);

    const handleOpenAddToCartDialog = useCallback(wishlistItem => {
        setActiveAddToCartItem(wishlistItem);
    }, []);

    const handleCloseAddToCartDialog = useCallback(() => {
        setActiveAddToCartItem(null);
    }, []);

    return {
        activeAddToCartItem,
        handleCloseAddToCartDialog,
        handleOpenAddToCartDialog
    };
};
