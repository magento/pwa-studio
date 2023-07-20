import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useCartContext } from '../../context/cart';
import mergeOperations from '../../util/shallowMerge';
import DEFAULT_OPERATIONS from './cartPage.gql';

import { useHistory } from 'react-router-dom';
import { useAddToQuote } from '../QuickOrderForm/useAddToQuote';
/**
 * This talon contains logic for a cart page component.
 * It performs effects and returns prop data for rendering the component.
 *
 * This talon performs the following effects:
 *
 * - Manages the updating state of the cart while cart details data is being fetched
 *
 * @function
 *
 * @param {Object} props
 * @param {CartPageQueries} props.queries GraphQL queries
 *
 * @returns {CartPageTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage';
 */
export const useCartPage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCartDetailsQuery, removeItemFromCartMutation } = operations;

    const history = useHistory();
    const [removeItem] = useMutation(removeItemFromCartMutation);

    const [{ cartId }] = useCartContext();

    const [isCartUpdating, setIsCartUpdating] = useState(false);
    const [wishlistSuccessProps, setWishlistSuccessProps] = useState(null);
    const [isSubmitQuoteDisabled, setIsSubmitQuoteDisabled] = useState(false);

    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const { handleAddCofigItemBySku } = useAddToQuote();

    const [fetchCartDetails, { called, data, loading }] = useLazyQuery(getCartDetailsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
        // errorPolicy: 'all'
    });

    const hasItems = !!(data && data.cart.total_quantity);
    const shouldShowLoadingIndicator = called && loading && !hasItems;

    const cartItems = useMemo(() => {
        return (data && data.cart.items) || [];
    }, [data]);

    const onAddToWishlistSuccess = useCallback(successToastProps => {
        setWishlistSuccessProps(successToastProps);
    }, []);

    useEffect(() => {
        if (!called && cartId) {
            fetchCartDetails({ variables: { cartId } });
        }

        // Let the cart page know it is updating while we're waiting on network data.
        setIsCartUpdating(loading);
    }, [fetchCartDetails, called, cartId, loading]);

    const [csvErrorType, setCsvErrorType] = useState('');
    const [csvSkuErrorList, setCsvSkuErrorList] = useState([]);

    const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false);

    const arrayCompare = (_arr1, _arr2) => {
        if (!Array.isArray(_arr1) || !Array.isArray(_arr2) || _arr1.length !== _arr2.length) {
            return false;
        }

        // .concat() to not mutate arguments
        const arr1 = _arr1.concat().sort();
        const arr2 = _arr2.concat().sort();

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    };

    const selectedVariants = useMemo(
        () =>
            cartItems.length > 0 &&
            cartItems?.map(confgItem => {
                const selectedOption = confgItem.configurable_options.map(
                    ({ configurable_product_option_value_uid }) => configurable_product_option_value_uid
                );
                const selectedVariant = confgItem?.product.variants.find(varEle => {
                    const variantOption = varEle.attributes.map(({ uid }) => uid);
                    return arrayCompare(selectedOption, variantOption);
                });
                return {
                    name: selectedVariant?.product?.name,
                    sku: selectedVariant?.product?.sku,
                    orParentSku: confgItem.product?.sku,
                    quantity: confgItem.quantity
                };
            }),
        [cartItems]
    );

    const submitQuote = useCallback(async () => {
        try {
            setIsSubmitQuoteDisabled(true);
            await handleAddCofigItemBySku(selectedVariants);
            await cartItems.forEach(async ({ uid }) => {
                await removeItem({
                    variables: {
                        cartId,
                        itemId: uid
                    }
                });
            });
            history.push('/mprequestforquote/customer/quotes');
            setIsSubmitQuoteDisabled(false);
        } catch (error) {
            const err = error.toString();
            setIsSubmitQuoteDisabled(false);
            throw err;
        }
    }, [cartId, cartItems, selectedVariants, handleAddCofigItemBySku, removeItem]);

    const handleCancelCsvDialog = useCallback(() => {
        setIsCsvDialogOpen(false);
    }, []);

    return {
        cartItems,
        hasItems,
        isCartUpdating,
        fetchCartDetails,
        onAddToWishlistSuccess,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        wishlistSuccessProps,
        csvErrorType,
        setCsvErrorType,
        csvSkuErrorList,
        setCsvSkuErrorList,
        isCsvDialogOpen,
        setIsCsvDialogOpen,
        handleCancelCsvDialog,
        isQuoteOpen,
        setIsQuoteOpen,
        selectedVariants,
        submitQuote,
        isSubmitQuoteDisabled
    };
};

/** JSDoc type definitions */

/**
 * GraphQL formatted string queries used in this talon.
 *
 * @typedef {Object} CartPageQueries
 *
 * @property {GraphQLAST} getCartDetailsQuery Query for getting the cart details.
 *
 * @see [cartPage.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/cartPage.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering a cart page component.
 *
 * @typedef {Object} CartPageTalonProps
 *
 * @property {Array<Object>} cartItems An array of item objects in the cart.
 * @property {boolean} hasItems True if the cart has items. False otherwise.
 * @property {boolean} isCartUpdating True if the cart is updating. False otherwise.
 * @property {function} setIsCartUpdating Callback function for setting the updating state of the cart page.
 * @property {boolean} shouldShowLoadingIndicator True if the loading indicator should be rendered. False otherwise.
 */
