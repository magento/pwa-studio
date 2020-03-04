import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

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
    const [updateItemQuantity, { error: updateError }] = useMutation(
        updateItemQuantityMutation
    );

    const [{ cartId }] = useCartContext();
    const [{ drawer }, { toggleDrawer }] = useAppContext();

    const [isFavorite, setIsFavorite] = useState(false);

    const updateItemErrorMessage = useMemo(() => {
        if (!updateError) return null;

        if (updateError.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            return updateError.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        }

        // A non-GraphQL error occurred.
        return updateError.message;
    }, [updateError]);

    const handleToggleFavorites = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite]);

    const handleEditItem = useCallback(() => {
        setActiveEditItem(item);
        toggleDrawer('edit');
    }, [item, setActiveEditItem, toggleDrawer]);

    useEffect(() => {
        if (drawer === null) {
            setActiveEditItem(null);
        }
    }, [drawer, setActiveEditItem]);

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
            } catch (err) {
                // Do nothing. The error message is handled above.
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
        isEditable: !!flatProduct.options.length,
        isFavorite,
        product: flatProduct,
        updateItemErrorMessage
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
