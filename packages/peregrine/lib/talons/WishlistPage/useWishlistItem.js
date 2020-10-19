import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';

import { useCartContext } from '../../context/cart';

/**
 * @function
 *
 * @param {String} props.childSku SKU of the child item
 * @param {WishlistItemMutations} props.mutations GraphQL mutations for the Wishlist Item component
 * @param {String} props.sku SKU of the item
 *
 * @returns {WishlistItemProps}
 */
export const useWishlistItem = props => {
    const { childSku, mutations, sku } = props;
    const { addWishlistItemToCartMutation } = mutations;

    const [{ cartId }] = useCartContext();
    const [actionsDialogIsOpen, setActionsDialogIsOpen] = useState(false);

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
        setActionsDialogIsOpen(true);
    }, [setActionsDialogIsOpen]);

    const handleCloseActionsDialog = useCallback(() => {
        setActionsDialogIsOpen(false);
    }, [setActionsDialogIsOpen]);

    return {
        actionsDialogIsOpen,
        handleAddToCart,
        handleCloseActionsDialog,
        handleMoreActions,
        hasError: !!error,
        isLoading: loading
    };
};

/**
 * JSDoc type definitions
 */

/**
 * GraphQL mutations for the Wishlist Item component
 *
 * @typedef {Object} WishlistItemMutations
 *
 * @property {GraphQLAST} addWishlistItemToCartMutation Mutation to add item to the cart
 *
 * @see [`wishlistItem.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/WishlistPage/wishlistItem.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering the Wishlist Item component
 *
 * @typedef {Object} WishlistItemProps
 *
 * @property {Boolean} actionsDialogIsOpen Whether the actions dialog is open or not
 * @property {Function} handleAddToCart Callback to handle item addition to cart
 * @property {Function} handleCloseActionsDialog Callback to handle closing the actions dialog
 * @property {Function} handleMoreActions Callback to handle more actions
 * @property {Boolean} hasError Boolean which represents if there were errors during the mutation
 * @property {Boolean} isLoading Boolean which represents if data is loading
 */
