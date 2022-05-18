import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { useCartContext } from '../../context/cart';
import { useEventingContext } from '../../context/eventing';
import operations from './addToCart.gql';

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

export const useAddToCartButton = props => {
    const { item, urlSuffix } = props;

    const [, { dispatch }] = useEventingContext();

    const [isLoading, setIsLoading] = useState(false);

    const isInStock = item.stock_status === 'IN_STOCK';

    const productType = item.__typename;
    const isUnsupportedProductType = UNSUPPORTED_PRODUCT_TYPES.includes(
        productType
    );
    const isDisabled = isLoading || !isInStock || isUnsupportedProductType;

    const history = useHistory();

    const [{ cartId }] = useCartContext();

    const [addToCart] = useMutation(operations.ADD_ITEM);

    const handleAddToCart = useCallback(async () => {
        try {
            if (productType === 'SimpleProduct') {
                setIsLoading(true);

                const quantity = 1;

                await addToCart({
                    variables: {
                        cartId,
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

                dispatch({
                    type: 'CART_ADD_ITEM',
                    payload: {
                        cartId,
                        sku: item.sku,
                        name: item.name,
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
            } else if (productType === 'ConfigurableProduct') {
                history.push(`${item.url_key}${urlSuffix || ''}`);
            } else {
                console.warn('Unsupported product type unable to handle.');
            }
        } catch (error) {
            console.error(error);
        }
    }, [productType, addToCart, cartId, item, dispatch, history, urlSuffix]);

    return {
        handleAddToCart,
        isDisabled,
        isInStock
    };
};
