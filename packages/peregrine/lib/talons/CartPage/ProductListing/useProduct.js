import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useProduct = props => {
    const { item, removeItemMutation, updateItemQuantityMutation } = props;

    const flatProduct = flattenProduct(item);
    const [removeItem] = useMutation(removeItemMutation);
    const [updateItemQuantity] = useMutation(updateItemQuantityMutation);

    const [{ cartId }] = useCartContext();

    const [isUpdating, setIsUpdating] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleToggleFavorites = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite]);

    const handleEditItem = useCallback(() => {
        // Edit Item action to be completed by PWA-272.
    }, []);

    const handleRemoveFromCart = useCallback(async () => {
        setIsUpdating(true);
        const { error } = await removeItem({
            variables: {
                cartId,
                itemId: item.id
            }
        });

        if (error) {
            setIsUpdating(false);
            console.error('Cart Item Removal Error', error);
        }
    }, [cartId, item.id, removeItem]);

    const handleUpdateItem = useCallback(
        async quantity => {
            try {
                setIsUpdating(true);
                const { error } = await updateItemQuantity({
                    variables: {
                        cartId,
                        itemId: item.id,
                        quantity
                    }
                });

                if (error) {
                    console.error('Cart Item Update Error', error);
                }
            } catch (err) {
                console.error('Cart Item Update Error', err);
            } finally {
                setIsUpdating(false);
            }
        },
        [cartId, item.id, updateItemQuantity]
    );

    return {
        handleEditItem,
        handleRemoveFromCart,
        handleToggleFavorites,
        handleUpdateItem,
        isFavorite,
        isUpdating,
        product: flatProduct
    };
};

const flattenProduct = item => {
    const {
        configurable_options: options = [],
        prices,
        product,
        quantity
    } = item;

    const { price } = prices;
    const { value: unitPrice, currency } = price;

    const { name, small_image } = product;
    const { url: image } = small_image;

    return { currency, image, name, options, quantity, unitPrice };
};
