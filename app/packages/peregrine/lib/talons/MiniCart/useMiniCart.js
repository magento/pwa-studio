import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import { useCartContext } from '../../context/cart';
import { useEventingContext } from '../../context/eventing';
import { useStoreConfigContext } from '../../context/storeConfigProvider';
import { deriveErrorMessage } from '../../util/deriveErrorMessage';

import CART_OPERATIONS from '../CartPage/cartPage.gql';
import mergeOperations from '../../util/shallowMerge';

import { useAddToQuote } from '../QuickOrderForm/useAddToQuote';

/**
 *
 * @param {Boolean} props.isOpen - True if the mini cart is open
 * @param {Function} props.setIsOpen - Function to toggle the mini cart
 * @param {DocumentNode} props.operations.getMiniCartQuery - Query to fetch mini cart data
 * @param {DocumentNode} props.operations.removeItemFromCartMutation - Mutation to remove an item from cart
 *
 * @returns {
 *      closeMiniCart: Function,
 *      errorMessage: String,
 *      handleEditCart: Function,
 *      handleProceedToCheckout: Function,
 *      handleRemoveItem: Function,
 *      loading: Boolean,
 *      productList: Array<>,
 *      subTotal: Number,
 *      totalQuantity: Number
 *      configurableThumbnailSource: String
 *  }
 */
export const useMiniCart = props => {
    const { isOpen, setIsOpen } = props;
    const [, { dispatch }] = useEventingContext();

    const [isSubmitQuoteDisabled, setIsSubmitQuoteDisabled] = useState(false);
    const { handleAddCofigItemBySku } = useAddToQuote();

    const operations = mergeOperations(CART_OPERATIONS, props.operations);
    const { removeItemFromCartMutation, getMiniCartQuery } = operations;

    const [{ cartId }] = useCartContext();
    const history = useHistory();

    const { data: miniCartData, loading: miniCartLoading } = useQuery(getMiniCartQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: { cartId },
        skip: !cartId,
        errorPolicy: 'all'
    });

        const { data: storeConfigData } = useStoreConfigContext();

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

    const [removeItem, { loading: removeItemLoading, called: removeItemCalled, error: removeItemError }] = useMutation(
        removeItemFromCartMutation
    );

    const totalQuantity = useMemo(() => {
        if (!miniCartLoading && miniCartData) {
            return miniCartData?.cart?.total_quantity;
        }
    }, [miniCartData, miniCartLoading]);

    const subTotal = useMemo(() => {
        if (!miniCartLoading && miniCartData) {
            return miniCartData?.cart?.prices?.subtotal_excluding_tax;
        }
    }, [miniCartData, miniCartLoading]);

    const productList = useMemo(() => {
        if (!miniCartLoading && miniCartData) {
            return miniCartData?.cart?.items;
        }
    }, [miniCartData, miniCartLoading]);

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
    const SelectedVariants = useMemo(
        () =>
            productList?.map(confgItem => {
                const selectedOption = confgItem.configurable_options.map(
                    ({ configurable_product_option_value_uid }) => configurable_product_option_value_uid
                );
                const selectedVariant = confgItem.product.variants.find(varEle => {
                    const variantOption = varEle.attributes.map(({ uid }) => uid);
                    return arrayCompare(selectedOption, variantOption);
                });
                return {
                    name: selectedVariant.product.name,
                    sku: selectedVariant.product.sku,
                    orParentSku: confgItem.product.sku,
                    quantity: confgItem.quantity
                };
            }),
        [productList]
    );

    const submitQuote = useCallback(async () => {
        try {
            setIsSubmitQuoteDisabled(true);
            await handleAddCofigItemBySku(SelectedVariants);
            productList.forEach(async ({ uid }) => {
                await removeItem({
                    variables: {
                        cartId,
                        itemId: uid
                    }
                });
            });
            setIsOpen(false);
            history.push('/mprequestforquote/customer/quotes');
            setIsSubmitQuoteDisabled(false);
        } catch (error) {
            const err = error.toString();
            setIsSubmitQuoteDisabled(false);
            throw err;
        }
    }, [cartId, productList, SelectedVariants, handleAddCofigItemBySku, setIsOpen, removeItem]);

    const closeMiniCart = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    const handleRemoveItem = useCallback(
        async id => {
            try {
                await removeItem({
                    variables: {
                        cartId,
                        itemId: id
                    }
                });
                const [product] = productList.filter(p => (p.uid || p.id) === id);

                const selectedOptionsLabels =
                    product.configurable_options?.map(({ option_label, value_label }) => ({
                        attribute: option_label,
                        value: value_label
                    })) || null;

                dispatch({
                    type: 'CART_REMOVE_ITEM',
                    payload: {
                        cartId,
                        sku: product.product.sku,
                        name: product.product.name,
                        priceTotal: product.prices.price.value,
                        currencyCode: product.prices.price.currency,
                        discountAmount: product.prices.total_item_discount.value,
                        selectedOptions: selectedOptionsLabels,
                        quantity: product.quantity
                    }
                });
            } catch (e) {
                // Error is logged by apollo link - no need to double log.
            }
        },
        [removeItem, cartId, dispatch, productList]
    );

    const handleProceedToCheckout = useCallback(() => {
        setIsOpen(false);
        history.push('/checkout');
    }, [history, setIsOpen]);

    const handleEditCart = useCallback(() => {
        setIsOpen(false);
        history.push('/cart');
    }, [history, setIsOpen]);

    const derivedErrorMessage = useMemo(() => deriveErrorMessage([removeItemError]), [removeItemError]);

    useEffect(() => {
        if (isOpen) {
            dispatch({
                type: 'MINI_CART_VIEW',
                payload: {
                    cartId: cartId,
                    products: productList
                }
            });
        }
    }, [isOpen, cartId, productList, dispatch]);

    return {
        closeMiniCart,
        errorMessage: derivedErrorMessage,
        handleEditCart,
        handleProceedToCheckout,
        handleRemoveItem,
        loading: miniCartLoading || (removeItemCalled && removeItemLoading),
        productList,
        subTotal,
        totalQuantity,
        configurableThumbnailSource,
        storeUrlSuffix,
        SelectedVariants,
        submitQuote,
        isSubmitQuoteDisabled
    };
};
