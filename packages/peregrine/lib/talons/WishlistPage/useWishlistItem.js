import { useCallback } from 'react';
import { useMutation } from '@apollo/client';

import { useCartContext } from '../../context/cart';

export const useWishlistItem = props => {
    const { childSku, mutations, sku } = props;
    const { addWishlistItemToCartMutation } = mutations;

    const [{ cartId }] = useCartContext();

    const cartItem = {
        data: {
            quantity: 1,
            sku: childSku || sku
        }
    };

    // Merge in additional input variables for configurable items
    if (childSku) {
        Object.assign(cartItem, {
            parent_sku: sku,
            variant_sku: childSku
        });
    }

    const [addWishlistItemToCart, { error, loading }] = useMutation(
        addWishlistItemToCartMutation,
        {
            variables: {
                cartId,
                cartItem
            }
        }
    );

    const handleAddToCart = useCallback(async () => {
        try {
            await addWishlistItemToCart();
        } catch {
            return;
        }
    }, [addWishlistItemToCart]);

    const handleMoreActions = useCallback(() => {
        console.log('To be handled by PWA-632');
    }, []);

    return {
        handleAddToCart,
        handleMoreActions,
        hasError: !!error,
        isLoading: loading
    };
};
