import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

export const useProduct = props => {
    const {
        beginEditItem,
        createCartMutation,
        getCartDetailsQuery,
        item,
        removeItemMutation
    } = props;
    const { configurable_options: options, product, quantity, prices } = item;
    const { price } = prices;
    const { small_image: image, name } = product;

    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [, { removeItemFromCart }] = useCartContext();

    const [fetchCartId] = useMutation(createCartMutation);
    const [removeItem] = useMutation(removeItemMutation);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

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
            fetchCartDetails,
            fetchCartId,
            removeItem
        });
    }, [fetchCartDetails, fetchCartId, item, removeItem, removeItemFromCart]);

    return {
        handleEditItem,
        handleFavoriteItem,
        handleRemoveItem,
        isFavorite,
        isLoading,
        productImage: image.url,
        productName: name,
        productOptions: options,
        productPrice: price.value,
        productQuantity: quantity
    };
};
