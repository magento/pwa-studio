import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import { useCartContext } from '../../../context/cart';

export const useProduct = props => {
    const {
        item,
        removeItemMutation,
        setActiveEditItem,
        setIsUpdating,
        updateItemQuantityMutation
    } = props;

    const flatProduct = flattenProduct(item);
    const [removeItem] = useMutation(removeItemMutation);
    const [updateItemQuantity] = useMutation(updateItemQuantityMutation);

    const [{ cartId }] = useCartContext();
    const [, { toggleDrawer }] = useAppContext();

    const [isFavorite, setIsFavorite] = useState(false);

    const handleToggleFavorites = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite]);

    const handleEditItem = useCallback(() => {
        setActiveEditItem(item);
        toggleDrawer('edit');
    }, [item, setActiveEditItem, toggleDrawer]);

    const handleRemoveFromCart = useCallback(async () => {
        try {
            setIsUpdating(true);
            const { error } = await removeItem({
                variables: {
                    cartId,
                    itemId: item.id
                }
            });

            if (error) {
                throw error;
            }
        } catch (err) {
            // TODO: Toast?
            console.error('Cart Item Removal Error', err);
        } finally {
            setIsUpdating(false);
        }
    }, [cartId, item.id, removeItem, setIsUpdating]);

    const handleUpdateItemQuantity = useCallback(
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
                    throw error;
                }
            } catch (err) {
                // TODO: Toast?
                console.error('Cart Item Update Error', err);
            } finally {
                setIsUpdating(false);
            }
        },
        [cartId, item.id, setIsUpdating, updateItemQuantity]
    );

    return {
        handleEditItem,
        handleRemoveFromCart,
        handleToggleFavorites,
        handleUpdateItemQuantity,
        isFavorite,
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
