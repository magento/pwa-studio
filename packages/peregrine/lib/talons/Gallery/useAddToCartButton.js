import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { useCartContext } from '../../context/cart';
import operations from './addToCart.gql';

/** 
 * @param {Array}     UNSUPPORTED_PRODUCT_TYPES - contains list of product types that are not simple
 * @param {Object}    item
 * @param {Function}  item.stock_status - check if item is in stock
 * @param {Bool}      isLoading - Indicates whether the query is in flight 
 * @param {Bool}      isDisabled - diables button if true
 * @param {Function}  handleAddToCart - based on productType will add item to cart and update cart 
 * 
 * @returns {Function}  handleAddTocart- adds item to cart
 * @returns {Bool}      isDisabled- disables button
 * @returns {Bool}      isInStock- Indicated if item is in stock
 *
 */
const UNSUPPORTED_PRODUCT_TYPES = ["virtual", "bundle", "grouped", "downloadable"]

export const useAddToCartButton = props => {
    const { item } = props;

    const [isLoading, setIsLoading] = useState(false);

    const isInStock = item.stock_status === 'IN_STOCK';

    const productType = item.type_id;
    const isUnsupportedProductType = UNSUPPORTED_PRODUCT_TYPES.includes(productType)
    const isDisabled = isLoading || !isInStock || isUnsupportedProductType;

    const history = useHistory();

    const [{ cartId }] = useCartContext();

    const [addToCart, { data }] = useMutation(operations.ADD_ITEM);

    const handleAddToCart = useCallback(async () => {
        try {
            if (productType === "simple") {
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
                })

                setIsLoading(false);
            }
            else if (productType === "configurable") {
                history.push(`${item.url_key}.html`);
            }
            else {
                console.warn('Unsupported product type unable to handle.');
            }
        } catch (error) {
            console.error(error);
        }
    }, [item]);

    return {
        isLoading,
        handleAddToCart,
        isDisabled,
        isInStock
    };
}
