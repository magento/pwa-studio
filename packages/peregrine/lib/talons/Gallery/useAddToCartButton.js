import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { useCartContext } from '../../context/cart';
import operations from './addToCart.gql';

/**
 * @param {Number} props.item.id - id of item
 * @param {String} props.item.name - name of item
 * @param {String} props.item.stock_status - stock status of item
 * @param {String} props.item.type_id - product type
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
    'virtual',
    'bundle',
    'grouped',
    'downloadable'
];

export const useAddToCartButton = props => {
    const { item } = props;

    const [isLoading, setIsLoading] = useState(false);

    const isInStock = item.stock_status === 'IN_STOCK';

    const productType = item.type_id;
    const isUnsupportedProductType = UNSUPPORTED_PRODUCT_TYPES.includes(
        productType
    );
    const isDisabled = isLoading || !isInStock || isUnsupportedProductType;

    const history = useHistory();

    const [{ cartId }] = useCartContext();

    const [addToCart] = useMutation(operations.ADD_ITEM);

    const handleAddToCart = useCallback(async () => {
        try {
            if (productType === 'simple') {
                setIsLoading(true);

                await addToCart({
                    variables: {
                        cartId,
                        cartItem: {
                            quantity: 1,
                            selected_options: [],
                            sku: item.sku
                        }
                    }
                });

                setIsLoading(false);
            } else if (productType === 'configurable') {
                history.push(`${item.url_key}.html`);
            } else {
                console.warn('Unsupported product type unable to handle.');
            }
        } catch (error) {
            console.error(error);
        }
    }, [addToCart, cartId, history, item.sku, item.url_key, productType]);

    return {
        handleAddToCart,
        isDisabled,
        isInStock
    };
};
