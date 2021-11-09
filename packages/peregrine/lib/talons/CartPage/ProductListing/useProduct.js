import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';

import { deriveErrorMessage } from '../../../util/deriveErrorMessage';
import DEFAULT_OPERATIONS from './product.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

/**
 * This talon contains logic for a product component used in a product listing component.
 * It performs effects and returns prop data for that component.
 *
 * This talon performs the following effects:
 *
 * - Manage the updating state of the cart while a product is being updated or removed
 *
 * @function
 *
 * @param {Object} props
 * @param {ProductItem} props.item Product item data
 * @param {ProductMutations} props.operations GraphQL mutations for a product in a cart
 * @param {function} props.setActiveEditItem Function for setting the actively editing item
 * @param {function} props.setIsCartUpdating Function for setting the updating state of the cart
 *
 * @return {ProductTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useProduct } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';
 */

export const useProduct = props => {
    const {
        item,
        setActiveEditItem,
        setIsCartUpdating,
        wishlistConfig
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        removeItemMutation,
        updateItemQuantityMutation,
        getStoreConfigQuery
    } = operations;

    const { formatMessage } = useIntl();

    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const configurableThumbnailSource = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.configurable_thumbnail_source;
        }
    }, [storeConfigData]);

    const storeUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.product_url_suffix;
        }
    }, [storeConfigData]);

    const flatProduct = flattenProduct(
        item,
        configurableThumbnailSource,
        storeUrlSuffix
    );

    const [
        removeItemFromCart,
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

    const [{ cartId }] = useCartContext();

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

    const isProductUpdating = useMemo(() => {
        if (updateItemCalled || removeItemCalled) {
            return removeItemLoading || updateItemLoading;
        } else {
            return false;
        }
    }, [
        updateItemCalled,
        removeItemCalled,
        removeItemLoading,
        updateItemLoading
    ]);

    useEffect(() => {
        if (item.errors) {
            setDisplayError(true);
        }
    }, [item.errors]);

    const derivedErrorMessage = useMemo(() => {
        return (
            (displayError &&
                deriveErrorMessage([updateError, removeItemError])) ||
            deriveErrorMessage([...(item.errors || [])]) ||
            ''
        );
    }, [displayError, removeItemError, updateError, item.errors]);

    const handleEditItem = useCallback(() => {
        setActiveEditItem(item);

        // If there were errors from removing/updating the product, hide them
        // when we open the modal.
        setDisplayError(false);
    }, [item, setActiveEditItem]);

    const handleRemoveFromCart = useCallback(async () => {
        try {
            await removeItemFromCart({
                variables: {
                    cartId,
                    itemId: item.uid
                }
            });
        } catch (err) {
            // Make sure any errors from the mutation are displayed.
            setDisplayError(true);
        }
    }, [cartId, item.uid, removeItemFromCart]);

    const handleUpdateItemQuantity = useCallback(
        async quantity => {
            try {
                await updateItemQuantity({
                    variables: {
                        cartId,
                        itemId: item.uid,
                        quantity
                    }
                });
            } catch (err) {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);
            }
        },
        [cartId, item.uid, updateItemQuantity]
    );

    useEffect(() => {
        setIsCartUpdating(isProductUpdating);

        // Reset updating state on unmount
        return () => setIsCartUpdating(false);
    }, [setIsCartUpdating, isProductUpdating]);

    const addToWishlistProps = {
        afterAdd: handleRemoveFromCart,
        buttonText: () =>
            formatMessage({
                id: 'product.saveForLater',
                defaultMessage: 'Save for later'
            }),
        item: {
            quantity: item.quantity,
            selected_options: item.configurable_options
                ? item.configurable_options.map(
                      option => option.configurable_product_option_value_uid
                  )
                : [],
            sku: item.product.sku
        },
        storeConfig: wishlistConfig
    };

    return {
        addToWishlistProps,
        errorMessage: derivedErrorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleUpdateItemQuantity,
        isEditable: !!flatProduct.options.length,
        product: flatProduct,
        isProductUpdating
    };
};

const flattenProduct = (item, configurableThumbnailSource, storeUrlSuffix) => {
    const {
        configurable_options: options = [],
        prices,
        product,
        quantity
    } = item;

    const configured_variant = configuredVariant(options, product);

    const { price } = prices;
    const { value: unitPrice, currency } = price;

    const {
        name,
        small_image,
        stock_status: stockStatus,
        url_key: urlKey
    } = product;
    const { url: image } =
        configurableThumbnailSource === 'itself' && configured_variant
            ? configured_variant.small_image
            : small_image;

    return {
        currency,
        image,
        name,
        options,
        quantity,
        stockStatus,
        unitPrice,
        urlKey,
        urlSuffix: storeUrlSuffix
    };
};

/** JSDocs type definitions */

/**
 * GraphQL mutations for a product in a cart.
 * This is a type used by the {@link useProduct} talon.
 *
 * @typedef {Object} ProductMutations
 *
 * @property {GraphQLDocument} removeItemMutation Mutation for removing an item in a cart
 * @property {GraphQLDocument} updateItemQuantityMutation Mutation for updating the item quantity in a cart
 *
 * @see [product.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/ProductListing/product.js}
 * to see the mutations used in Venia
 */

/**
 * Object type returned by the {@link useProduct} talon.
 * It provides prop data for rendering a product component on a cart page.
 *
 * @typedef {Object} ProductTalonProps
 *
 * @property {String} errorMessage Error message from an operation perfored on a cart product.
 * @property {function} handleEditItem Function to use for handling when a product is modified.
 * @property {function} handleRemoveFromCart Function to use for handling the removal of a cart product.
 * @property {function} handleUpdateItemQuantity Function to use for handling updates to the product quantity in a cart.
 * @property {boolean} isEditable True if a cart product is editable. False otherwise.
 * @property {ProductItem} product Cart product data
 */

/**
 * Data about a product item in the cart.
 * This type is used in the {@link ProductTalonProps} type returned by the {@link useProduct} talon.
 *
 * @typedef {Object} ProductItem
 *
 * @property {String} currency The currency associated with the cart product
 * @property {String} image The url for the cart product image
 * @property {String} name The name of the product
 * @property {Array<Object>} options A list of configurable option objects
 * @property {number} quantity The quantity associated with the cart product
 * @property {number} unitPrice The product's unit price
 * @property {String} urlKey The product's url key
 * @property {String} urlSuffix The product's url suffix
 */
