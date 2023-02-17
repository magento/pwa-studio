import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { useCartContext } from '../../context/cart';
import operations from './addToCart.gql';
import { ADD_CONFIGURABLE_MUTATION, GET_PARENT_SKU } from '../QuickOrderForm/addProductByCsv.gql';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import resourceUrl from '../../util/makeUrl';
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
const UNSUPPORTED_PRODUCT_TYPES = ['VirtualProduct', 'BundleProduct', 'GroupedProduct', 'DownloadableProduct'];

export const useAddToCartButton = props => {
    const { item, urlSuffix, quantity } = props;

    const [isLoading, setIsLoading] = useState(false);

    const getParentSku = useAwaitQuery(GET_PARENT_SKU);

    const isInStock = item.stock_status === 'IN_STOCK';
    const productType = item.__typename;
    const isUnsupportedProductType = UNSUPPORTED_PRODUCT_TYPES.includes(productType);
    const isDisabled =
        isLoading || !isInStock || isUnsupportedProductType || item.price?.regularPrice?.amount?.value === -1;
    const history = useHistory();

    const [{ cartId }] = useCartContext();

    const [addToCart] = useMutation(operations.ADD_ITEM);

    const [addConfigurableProductToCart] = useMutation(ADD_CONFIGURABLE_MUTATION);

    const handleAddToCart = useCallback(async () => {
        try {
            if (productType === 'SimpleProduct') {
                setIsLoading(true);

                const parentSkuResponse = await getParentSku({
                    variables: { sku: item.sku }
                });

                const parentSku = parentSkuResponse.data.products.items[0].orParentSku;

                await addConfigurableProductToCart({
                    variables: {
                        cartId,
                        quantity: quantity || 1,
                        sku: item.sku,
                        parentSku: item.parentSku || parentSku
                    }
                });

                // await addToCart({  NOTE : USE addConfigurableProductToCart method
                //     variables: {
                //         cartId,
                //         cartItem: {
                //             quantity: quantity || 1,
                //             entered_options: [
                //                 {
                //                     uid: item.uid,
                //                     value: item.name
                //                 }
                //             ],
                //             sku: item.sku
                //         }
                //     }
                // });

                setIsLoading(false);
            } else if (productType === 'ConfigurableProduct') {
                const productLink = resourceUrl(`/${item.url_key}${urlSuffix || ''}`);

                history.push(productLink);
            } else {
                console.warn('Unsupported product type unable to handle.');
            }
        } catch (error) {
            console.error(error);
        }
    }, [
        productType,
        getParentSku,
        item.sku,
        item.parentSku,
        item.url_key,
        addConfigurableProductToCart,
        cartId,
        quantity,
        urlSuffix,
        history
    ]);

    return {
        handleAddToCart,
        isDisabled,
        isInStock
    };
};
