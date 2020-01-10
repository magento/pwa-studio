import { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../context/cart';

export const useProduct = props => {
    const { item, removeItemMutation } = props;

    const flatProduct = flattenProduct(item);
    const [removeItem] = useMutation(removeItemMutation);

    const [{ cartId }] = useCartContext();

    const handleRemoveFromCart = useCallback(() => {
        removeItem({
            variables: {
                cartId,
                itemId: item.id
            }
        });
    }, [cartId, item.id, removeItem]);

    return {
        handleEditItem: () => {},
        handleRemoveFromCart,
        handleToggleFavorites: () => {},
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
