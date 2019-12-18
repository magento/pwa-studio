import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useProduct = props => {
    const {
        beginEditItem,
        createCartMutation,
        getCartDetailsQuery,
        item,
        removeItemMutation
    } = props;
    const { configurable_options: options, product, quantity } = item;
    const { small_image: image, name, price } = product;
    const { regularPrice } = price;
    const { amount } = regularPrice;

    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [, { removeItemFromCart }] = useCartContext();

    const [fetchCartId] = useMutation(createCartMutation);
    const [removeItem] = useMutation(removeItemMutation);

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
            getCartDetailsQuery,
            fetchCartId,
            removeItem
        });
    }, [
        fetchCartId,
        getCartDetailsQuery,
        item,
        removeItem,
        removeItemFromCart
    ]);

    return {
        handleEditItem,
        handleFavoriteItem,
        handleRemoveItem,
        isFavorite,
        isLoading,
        productImage: image.url,
        productName: name,
        productOptions: options,
        productPrice: amount.value,
        productQuantity: quantity
    };
};
