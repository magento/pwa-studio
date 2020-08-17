import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

/**
 * This talon contains logic for a Product component used in a Product Listing component.
 * It performs effects and returns prop data for that component.
 * 
 * @function
 * 
 * @param {Object} props
 * @param {ProductItem} props.item Product item data
 * @param {ProductMutations} props.mutations GraphQL mutations for a product in a cart
 * @param {function} props.setActiveEditItem Function for setting the actively editing item
 * @param {function} props.setIsCartUpdating Function for setting the updating state of the cart
 * 
 * @return {ProductProps}
 */
export const useProduct = props => {
    const {
        item,
        /**
         * GraphQL mutations for a product in a cart
         * 
         * @typedef {Object} ProductMutations
         * 
         * @property {GraphQLAST} removeItemMutation Mutation for removing an item in a cart
         * @property {GraphQLAST} updateItemQuantityMutation Mutation for updating the item quantity in a cart
         * 
         * @see [product.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/ProductListing/product.js}
         * to see the mutations used in Venia
         */
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

    const derivedErrorMessage = useMemo(() => {
        if (!updateError && !removeItemError) return null;

        const errorTarget = updateError || removeItemError;

        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            return errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        }

        // A non-GraphQL error occurred.
        return errorTarget.message;
    }, [removeItemError, updateError]);

    const handleToggleFavorites = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite]);

    const handleEditItem = useCallback(() => {
        setActiveEditItem(item);
        toggleDrawer('product.edit');
    }, [item, setActiveEditItem, toggleDrawer]);

    useEffect(() => {
        if (drawer === null) {
            setActiveEditItem(null);
        }
    }, [drawer, setActiveEditItem]);

    const handleRemoveFromCart = useCallback(() => {
        removeItem({
            variables: {
                cartId,
                itemId: item.id
            }
        });
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
                // Do nothing. The error message is handled above.
            }
        },
        [cartId, item.id, updateItemQuantity]
    );

    /**
     * Prop data for rendering a product component on a cart page
     * 
     * @typedef {Object} ProductProps
     */
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
    /**
     * Data about a product item in the cart
     * 
     * @typedef {Object} ProductItem
     * 
     * @property {Array<Object>} configurable_options A list of configurable option objects
     * @property {Object} prices
     * @property {Object} prices.price Price object
     * @property {String} prices.price.value The price value of a product
     * @property {String} prices.price.currency The currency associated with the price object
     * @property {Object} product
     * @property {String} product.name The name of the product
     * @property {Object} product.small_image
     * @property {String} product.small_image.url The url of a small image of the product
     * @property {String} product.url_key The product's url key
     * @property {String} product.url_suffix The product's url suffix
     * 
     */
    const {
        configurable_options: options = [],
        prices,
        product,
        quantity
    } = item;

    const { price } = prices;
    const { value: unitPrice, currency } = price;

    const { name, small_image, url_key, url_suffix } = product;
    const { url: image } = small_image;

    return {
        currency,
        image,
        name,
        options,
        quantity,
        unitPrice,
        urlKey: url_key,
        urlSuffix: url_suffix
    };
};
