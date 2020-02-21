import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import { useCartContext } from '../../../context/cart';

export const useProduct = props => {
    const { item, removeItemMutation, setActiveEditItem } = props;

    const flatProduct = flattenProduct(item);
    const [removeItem] = useMutation(removeItemMutation);

    const [{ cartId }] = useCartContext();
    const [, { toggleDrawer }] = useAppContext();

    const [isRemoving, setIsRemoving] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleToggleFavorites = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite]);

    const handleEditItem = useCallback(() => {
        setActiveEditItem(item);
        toggleDrawer('edit');
    }, [item, setActiveEditItem, toggleDrawer]);

    const handleRemoveFromCart = useCallback(async () => {
        setIsRemoving(true);
        const { error } = await removeItem({
            variables: {
                cartId,
                itemId: item.id
            }
        });

        if (error) {
            setIsRemoving(false);
            console.error('Cart Item Removal Error', error);
        }
    }, [cartId, item.id, removeItem]);

    return {
        handleEditItem,
        handleRemoveFromCart,
        handleToggleFavorites,
        isFavorite,
        isRemoving,
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
