import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { deriveErrorMessage } from '../../../util/deriveErrorMessage';

export const useProduct = props => {
    const {
        item,
        mutations: { removeItemMutation, updateItemQuantityMutation },
        setActiveEditItem,
        setIsCartUpdating
    } = props;

    const flatProduct = flattenProduct(item);

    const [
        removeItem,
        {
            called: removeItemCalled,
            error: removeItemError,
            loading: removeItemLoading
        }
    ] = useMutation(removeItemMutation);

    const [
        updateItemQuantity,
        {
            loading: updateItemLoading,
            error: updateError,
            called: updateItemCalled
        }
    ] = useMutation(updateItemQuantityMutation);

    useEffect(() => {
        if (updateItemCalled || removeItemCalled) {
            // If a product mutation is in flight, tell the cart.
            setIsCartUpdating(updateItemLoading || removeItemLoading);
        }

        // Reset updating state on unmount
        return () => setIsCartUpdating(false);
    }, [
        removeItemCalled,
        removeItemLoading,
        setIsCartUpdating,
        updateItemCalled,
        updateItemLoading
    ]);

    const [{ cartId }] = useCartContext();
    const [{ drawer }, { toggleDrawer }] = useAppContext();

    const [isFavorite, setIsFavorite] = useState(false);

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

    const derivedErrorMessage = useMemo(() => {
        return (
            (displayError &&
                deriveErrorMessage([updateError, removeItemError])) ||
            ''
        );
    }, [displayError, removeItemError, updateError]);

    const handleToggleFavorites = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite]);

    const handleEditItem = useCallback(() => {
        setActiveEditItem(item);
        toggleDrawer('product.edit');

        // If there were errors from removing/updating the product, hide them
        // when we open the modal.
        setDisplayError(false);
    }, [item, setActiveEditItem, toggleDrawer]);

    useEffect(() => {
        if (drawer === null) {
            setActiveEditItem(null);
        }
    }, [drawer, setActiveEditItem]);

    const handleRemoveFromCart = useCallback(() => {
        try {
            removeItem({
                variables: {
                    cartId,
                    itemId: item.id
                }
            });
        } catch (err) {
            // Make sure any errors from the mutation are displayed.
            setDisplayError(true);
        }
    }, [cartId, item.id, removeItem]);

    const handleUpdateItemQuantity = useCallback(
        async quantity => {
            try {
                await updateItemQuantity({
                    variables: {
                        cartId,
                        itemId: item.id,
                        quantity
                    }
                });
            } catch (err) {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);
            }
        },
        [cartId, item.id, updateItemQuantity]
    );

    return {
        errorMessage: derivedErrorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleToggleFavorites,
        handleUpdateItemQuantity,
        isEditable: !!flatProduct.options.length,
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

    const {
        name,
        small_image,
        stock_status: stockStatus,
        url_key: urlKey,
        url_suffix: urlSuffix
    } = product;
    const { url: image } = small_image;

    return {
        currency,
        image,
        name,
        options,
        quantity,
        stockStatus,
        unitPrice,
        urlKey,
        urlSuffix
    };
};
