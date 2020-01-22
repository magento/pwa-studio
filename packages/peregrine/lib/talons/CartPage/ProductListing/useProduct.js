import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useProduct = props => {
    const {
        item,
        refetchCartQuery,
        refetchPriceQuery,
        removeItemMutation
    } = props;

    const flatProduct = flattenProduct(item);
    const [removeItem] = useMutation(removeItemMutation);

    const [{ cartId }] = useCartContext();

    const [isRemoving, setIsRemoving] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleToggleFavorites = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite]);

    const handleEditItem = useCallback(() => {
        // Edit Item action to be completed by PWA-272.
    }, []);

    const handleRemoveFromCart = useCallback(async () => {
        setIsRemoving(true);
        const { error } = await removeItem({
            variables: {
                cartId,
                itemId: item.id
            },
            refetchQueries: [
                {
                    query: refetchCartQuery,
                    variables: { cartId }
                },
                {
                    query: refetchPriceQuery,
                    variables: { cartId }
                }
            ]
        });

        if (error) {
            setIsRemoving(false);
            console.error('Cart Item Removal Error', error);
        }
    }, [cartId, item.id, refetchCartQuery, refetchPriceQuery, removeItem]);

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
