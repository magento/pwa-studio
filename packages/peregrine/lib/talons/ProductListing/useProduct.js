import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../context/cart';

export const useProduct = props => {
    const { item, removeItemMutation } = props;

    const flatProduct = flattenProduct(item);
    const [removeItem] = useMutation(removeItemMutation);

    const [{ cartId }] = useCartContext();

    const [isRemoving, setIsRemoving] = useState(false);

    const handleEditItem = useCallback(() => {
        // Edit Item action to be completed by PWA-272.
    }, []);

    const handleRemoveFromCart = useCallback(() => {
        setIsRemoving(true);
        removeItem({
            variables: {
                cartId,
                itemId: item.id
            }
        });
    }, [cartId, item.id, removeItem]);

    return {
        handleEditItem,
        handleRemoveFromCart,
        handleToggleFavorites: () => {},
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
