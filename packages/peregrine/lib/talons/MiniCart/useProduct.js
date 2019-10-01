import { useCallback, useState } from 'react';

const imageWidth = 80;
const imageHeight = 100;

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

    const imageObj = {
        url: image.file,
        type: 'image-product',
        height: imageHeight,
        width: imageWidth
    };

    return {
        handleEditItem,
        handleFavoriteItem,
        handleRemoveItem,
        hasImage: image && image.file,
        image: imageObj,
        isFavorite,
        isLoading,
        productName: name,
        productOptions: options,
        productPrice: price,
        productQuantity: qty
    };
};
