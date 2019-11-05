import { useCallback, useState } from 'react';

export const useProduct = props => {
    const { beginEditItem, item, removeItemFromCart } = props;
    const { image, name, options, price, qty } = item;
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFavoriteItem = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite]);

    const handleEditItem = useCallback(() => {
        beginEditItem(item);
    }, [beginEditItem, item]);

    const handleRemoveItem = useCallback(() => {
        setIsLoading(true);
        removeItemFromCart({ item });
    }, [item, removeItemFromCart]);

    return {
        handleEditItem,
        handleFavoriteItem,
        handleRemoveItem,
        hasImage: image && image.file,
        isFavorite,
        isLoading,
        productName: name,
        productOptions: options,
        productPrice: price,
        productQuantity: qty
    };
};
