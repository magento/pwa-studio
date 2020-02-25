import { useCallback, useRef, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useProduct = props => {
    const {
        item,
        removeItemMutation,
        setIsUpdating,
        updateItemQuantityMutation
    } = props;

    const flatProduct = flattenProduct(item);
    const [removeItem] = useMutation(removeItemMutation);
    const [updateItemQuantity] = useMutation(updateItemQuantityMutation);

    const [{ cartId }] = useCartContext();

    const updateItemErrorMessage = useRef(null);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleToggleFavorites = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite]);

    const handleEditItem = useCallback(() => {
        // Edit Item action to be completed by PWA-272.
    }, []);

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
            setIsUpdating(true);

            try {
                await updateItemQuantity({
                    variables: {
                        cartId,
                        itemId: item.id,
                        quantity
                    }
                });
            } catch (updateItemError) {
                if (!updateItemError.graphQLErrors) {
                    updateItemErrorMessage.current = updateItemError.message;
                } else {
                    // Apollo prepends "GraphQL Error:" onto the message, so we build up
                    // the error message manually without the prepended text.
                    // There's no reason to show an end user "GraphQL Error".
                    updateItemErrorMessage.current = updateItemError.graphQLErrors
                        .map(({ message }) => message)
                        .join(',');
                }
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
        product: flatProduct,
        updateItemErrorMessage: updateItemErrorMessage.current
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
