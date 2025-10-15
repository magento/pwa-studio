import { useCallback, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { useCartContext } from '../../context/cart';
import { useEventingContext } from '../../context/eventing';
import resourceUrl from '../../util/makeUrl';
import operations from './addToCart.gql';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import BrowserPersistence from '../../util/simplePersistence';

/**
 * @param {String} props.item.uid - uid of item
 * @param {String} props.item.name - name of item
 * @param {String} props.item.stock_status - stock status of item
 * @param {String} props.item.__typename - product type
 * @param {String} props.item.url_key - item url key
 * @param {String} props.item.sku - item sku
 *
 * @returns {
 *      handleAddToCart: Function,
 *      isDisabled: Boolean,
 *      isInStock: Boolean
 * }
 *
 */
const UNSUPPORTED_PRODUCT_TYPES = [
    'VirtualProduct',
    'BundleProduct',
    'GroupedProduct',
    'DownloadableProduct'
];

const CREATE_CART_MUTATION = gql`
    mutation createCart {
        cartId: createEmptyCart
    }
`;

const CART_DETAILS_QUERY = gql`
    query checkUserIsAuthed($cartId: String!) {
        cart(cart_id: $cartId) {
            id
        }
    }
`;

export const useAddToCartButton = props => {
    const { item, urlSuffix } = props;

    const [, { dispatch }] = useEventingContext();

    const [isLoading, setIsLoading] = useState(false);

    const [cartState, cartApi] = useCartContext();
    const { cartId } = cartState;

    const [fetchCartId] = useMutation(CREATE_CART_MUTATION);
    const fetchCartDetails = useAwaitQuery(CART_DETAILS_QUERY);

    const isInStock = item.stock_status === 'IN_STOCK';

    const productType = item
        ? item.__typename !== undefined
            ? item.__typename
            : item.type
        : null;

    const isUnsupportedProductType = UNSUPPORTED_PRODUCT_TYPES.includes(
        productType
    );

    const isDisabled = isLoading || !isInStock || isUnsupportedProductType;

    const history = useHistory();

    const [addToCart] = useMutation(operations.ADD_ITEM);

    // helper: ensure we have a valid cartId before adding
    const ensureCartId = useCallback(async () => {
        let newCartId = cartId;
        if (!newCartId) {
            console.log('No cart ID found, creating a new cart...');
            await cartApi.getCartDetails({
                fetchCartId,
                fetchCartDetails
            });

            newCartId = new BrowserPersistence().getItem('cartId');

            if (!newCartId) {
                throw new Error('Failed to create a new cart');
            }
        }
        return newCartId;
    }, [cartId, cartApi, fetchCartId, fetchCartDetails]);

    const handleAddToCart = useCallback(async () => {
        try {
            if (productType === 'SimpleProduct' || productType === 'simple') {
                setIsLoading(true);

                const quantity = 1;
                let newCartId;

                if (item.uid) {
                    // ensure cart right before addToCart
                    newCartId = await ensureCartId();

                    await addToCart({
                        variables: {
                            cartId: newCartId,
                            cartItem: {
                                quantity,
                                entered_options: [
                                    {
                                        uid: item.uid,
                                        value: item.name
                                    }
                                ],
                                sku: item.sku
                            }
                        }
                    });
                } else {
                    // ensure cart right before addToCart
                    newCartId = await ensureCartId();

                    await addToCart({
                        variables: {
                            cartId: newCartId,
                            cartItem: {
                                quantity,
                                sku: item.sku
                            }
                        }
                    });
                }

                dispatch({
                    type: 'CART_ADD_ITEM',
                    payload: {
                        cartId: newCartId,
                        sku: item.sku,
                        name: item.name,
                        pricing: {
                            regularPrice: {
                                amount:
                                    item.price_range.maximum_price.regular_price
                            }
                        },
                        priceTotal:
                            item.price_range.maximum_price.final_price.value,
                        currencyCode:
                            item.price_range.maximum_price.final_price.currency,
                        discountAmount:
                            item.price_range.maximum_price.discount.amount_off,
                        selectedOptions: null,
                        quantity
                    }
                });

                setIsLoading(false);
            } else if (
                productType === 'ConfigurableProduct' ||
                productType === 'configurable'
            ) {
                const productLink = resourceUrl(
                    `/${item.url_key}${urlSuffix || ''}`
                );

                history.push(productLink);
            } else {
                console.warn('Unsupported product type unable to handle.');
            }
        } catch (error) {
            console.error(error);
        }
    }, [
        productType,
        addToCart,
        item,
        dispatch,
        history,
        urlSuffix,
        ensureCartId
    ]);

    return {
        handleAddToCart,
        isDisabled,
        isInStock
    };
};
