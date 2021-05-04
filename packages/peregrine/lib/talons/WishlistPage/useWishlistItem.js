import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '../../util/shallowMerge';
import defaultOperations from './wishlistItem.gql';

// Note: There is only ever zero (0) or one (1) dialogs open for a wishlist item.
const dialogs = {
    NONE: 1,
    CONFIRM_REMOVE_PRODUCT: 2,
    MORE_ACTIONS: 3
};

/**
 * @function
 *
 * @param {String} props.childSku SKU of the child item
 * @param {String} props.itemId The ID of the item
 * @param {WishlistItemOperations} props.operations GraphQL operations for the Wishlist Item component
 * @param {String} props.sku SKU of the item
 * @param {String} props.wishlistId The ID of the wishlist this item belongs to
 *
 * @returns {WishlistItemProps}
 */
export const useWishlistItem = props => {
    const { item, wishlistId } = props;
    const {
        configurable_options: selectedConfigurableOptions = [],
        id: itemId,
        product
    } = item;
    const {
        configurable_options: configurableOptions = [],
        image,
        sku,
        stock_status: stockStatus
    } = product;
    const { label: imageLabel, url: imageURL } = image;

    const operations = mergeOperations(defaultOperations, props.operations);
    const {
        addWishlistItemToCartMutation,
        removeProductsFromWishlistMutation
    } = operations;

    const [{ cartId }] = useCartContext();
    const [currentDialog, setCurrentDialog] = useState(dialogs.NONE);
    const [
        removeProductFromWishlistError,
        setRemoveProductFromWishlistError
    ] = useState(null);

    const cartItem = useMemo(() => {
        const item = {
            quantity: 1,
            sku
        };

        // Merge in additional input variables for configurable items
        if (
            selectedConfigurableOptions.length &&
            selectedConfigurableOptions.length === configurableOptions.length
        ) {
            const selectedOptionsArray = selectedConfigurableOptions.map(
                selectedOption => {
                    const {
                        id: attributeId,
                        value_id: selectedValueId
                    } = selectedOption;
                    const configurableOption = configurableOptions.find(
                        option => option.attribute_id_v2 === attributeId
                    );
                    const configurableOptionValue = configurableOption.values.find(
                        optionValue =>
                            optionValue.value_index === selectedValueId
                    );

                    return configurableOptionValue.uid;
                }
            );

            Object.assign(item, {
                selected_options: selectedOptionsArray
            });
        }

        return item;
    }, [configurableOptions, selectedConfigurableOptions, sku]);

    const [
        addWishlistItemToCart,
        {
            error: addWishlistItemToCartError,
            loading: addWishlistItemToCartLoading
        }
    ] = useMutation(addWishlistItemToCartMutation, {
        variables: {
            cartId,
            cartItem
        }
    });

    const [
        removeProductsFromWishlist,
        { loading: isRemovalInProgress }
    ] = useMutation(removeProductsFromWishlistMutation, {
        variables: {
            wishlistId: wishlistId,
            wishlistItemsId: [itemId]
        }
    });

    const handleAddToCart = useCallback(async () => {
        try {
            await addWishlistItemToCart();
        } catch (e) {
            console.error(e);
        }
    }, [addWishlistItemToCart]);

    const handleRemoveProductFromWishlist = useCallback(async () => {
        try {
            await removeProductsFromWishlist();

            // Close the dialogs on success.
            setCurrentDialog(dialogs.NONE);
        } catch (e) {
            setRemoveProductFromWishlistError(e);
            if (process.env.NODE_ENV !== 'production') {
                console.error(e);
            }
        }
    }, [
        removeProductsFromWishlist,
        setCurrentDialog,
        setRemoveProductFromWishlistError
    ]);

    const handleShowConfirmRemoval = useCallback(() => {
        // Before we show the removal confirmation dialog, clear out any previous errors.
        setRemoveProductFromWishlistError(null);
        setCurrentDialog(dialogs.CONFIRM_REMOVE_PRODUCT);
    }, [setCurrentDialog, setRemoveProductFromWishlistError]);

    const handleShowMoreActions = useCallback(() => {
        setCurrentDialog(dialogs.MORE_ACTIONS);
    }, [setCurrentDialog]);

    const handleHideDialogs = useCallback(() => {
        setCurrentDialog(dialogs.NONE);
    }, [setCurrentDialog]);

    // Derived state.
    const confirmRemovalIsOpen =
        currentDialog === dialogs.CONFIRM_REMOVE_PRODUCT;
    const moreActionsIsOpen = currentDialog === dialogs.MORE_ACTIONS;

    const addToCartButtonProps = useMemo(() => {
        return {
            disabled:
                addWishlistItemToCartLoading || stockStatus === 'OUT_OF_STOCK',
            onClick: handleAddToCart
        };
    }, [addWishlistItemToCartLoading, handleAddToCart, stockStatus]);

    const imageProps = useMemo(() => {
        return {
            alt: imageLabel,
            src: imageURL,
            width: 400
        };
    }, [imageLabel, imageURL]);

    return {
        addToCartButtonProps,
        confirmRemovalIsOpen,
        handleHideDialogs,
        handleRemoveProductFromWishlist,
        handleShowConfirmRemoval,
        handleShowMoreActions,
        hasError: !!addWishlistItemToCartError,
        hasRemoveProductFromWishlistError: !!removeProductFromWishlistError,
        imageProps,
        isRemovalInProgress,
        moreActionsIsOpen
    };
};

/**
 * JSDoc type definitions
 */

/**
 * GraphQL operations for the Wishlist Item component
 *
 * @typedef {Object} WishlistItemOperations
 *
 * @property {GraphQLDocument} addWishlistItemToCartMutation Mutation to add item to the cart
 * @property {GraphQLDocument} removeProductsFromWishlistMutation Mutation to remove a product from a wishlist
 *
 * @see [`wishlistItem.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/WishlistPage/wishlistItem.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering the Wishlist Item component
 *
 * @typedef {Object} WishlistItemProps
 *
 * @property {Boolean} confirmRemovalIsOpen Whether the confirm removal dialog is open
 * @property {Function} handleHideDialogs Callback to handle hiding all dialogs
 * @property {Function} handleRemoveProductFromWishlist Callback to actually remove product from wishlist
 * @property {Function} handleShowConfirmRemoval Callback to handle showing the removal confirmation prompt
 * @property {Function} handleShowMoreActions Callback to handle showing more actions
 * @property {Boolean} hasError Boolean which represents if there was an error adding the wishlist item to cart
 * @property {Boolean} hasRemoveProductFromWishlistError If there was an error removing a product from the wishlist
 * @property {Boolean} isLoading Boolean which represents if data is loading
 * @property {Boolean} isRemovalInProgress Whether the remove product from wishlist operation is in progress
 * @property {Boolean} moreActionsIsOpen Whether more actions are showing or not
 */
