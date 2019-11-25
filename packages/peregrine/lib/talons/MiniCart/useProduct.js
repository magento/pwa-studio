import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
export const useProduct = props => {
    const {
        beginEditItem,
        createCartMutation,
        item,
        removeItemFromCart
    } = props;
    const { image, name, options, price, qty } = item;
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [fetchCartId] = useMutation(createCartMutation);
    const handleFavoriteItem = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite]);

    const handleEditItem = useCallback(() => {
        beginEditItem(item);
    }, [beginEditItem, item]);

    const handleRemoveItem = useCallback(() => {
        setIsLoading(true);
        removeItemFromCart({
            item,
            fetchCartId
        });
    }, [fetchCartId, item, removeItemFromCart]);

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
