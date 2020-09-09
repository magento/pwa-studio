import { useCallback } from 'react';
import { useMutation } from '@apollo/client';

import { useCartContext } from '../../context/cart';
import { useToasts } from '../../Toasts';

const ADD_TO_CART_LABEL = 'Add to Cart';
const ADD_TO_CART_ERROR_MESSAGE =
    'Something went wrong. Please refresh and try again.';

export const useWishlistItem = props => {
    const {
        addToCartErrorMessage = ADD_TO_CART_ERROR_MESSAGE,
        childSku,
        mutations,
        sku
    } = props;
    const { addWishlistItemToCartMutation } = mutations;

    const [{ cartId }] = useCartContext();
    const [, { addToast }] = useToasts();

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

    const [addWishlistItemToCart, { loading }] = useMutation(
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
            addToast({
                type: 'error',
                message: addToCartErrorMessage,
                timeout: 5000
            });
        }
    }, [addToCartErrorMessage, addToast, addWishlistItemToCart]);

    const handleMoreActions = useCallback(() => {
        console.log('To be handled by PWA-632');
    }, []);

    return {
        addToCartLabel: ADD_TO_CART_LABEL,
        handleAddToCart,
        handleMoreActions,
        isLoading: loading
    };
};
