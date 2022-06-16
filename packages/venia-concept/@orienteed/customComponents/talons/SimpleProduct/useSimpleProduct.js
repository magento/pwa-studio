import { useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useIntl } from 'react-intl';
import defaultOperations from '@magento/peregrine/lib/talons/Gallery/gallery.gql';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { GET_SIMPLE_PRODUCT } from '../SimpleProduct/getSimpleProduct.gql';
import { useLocation } from 'react-router-dom';

const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct'];
export const useSimpleProduct = (props = {}) => {
    const { formatMessage } = useIntl();
    const { search } = useLocation();
    const sku = new URLSearchParams(search).get('sku');

    const operations = mergeOperations(defaultOperations, props.operations);
    const { addConfigurableProductToCartMutation, productQuantity } = props;

    const { data, loading, error } = useQuery(GET_SIMPLE_PRODUCT, {
        variables: { sku: sku }
    });

    const { data: storeConfigData } = useQuery(operations.getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const wishlistItemOptions = useMemo(() => {
        const options = {
            quantity: 1,
            sku: loading || !data ? 'No sku' : data.products.items[0].sku
        };

        return options;
    }, [data, loading]);

    const wishlistButtonProps = {
        buttonText: isSelected =>
            isSelected
                ? formatMessage({
                      id: 'wishlistButton.addedText',
                      defaultMessage: 'Added to Favorites'
                  })
                : formatMessage({
                      id: 'wishlistButton.addText',
                      defaultMessage: 'Add to Favorites'
                  }),
        item: wishlistItemOptions,
        storeConfig: storeConfigData ? storeConfigData.storeConfig : {}
    };

    const productType =
        loading || !data
            ? 'Simple product'
            : data.products.items[0].__typename || 'Simple product';

    const isSupportedProductType = SUPPORTED_PRODUCT_TYPES.includes(
        productType
    );

    const [{ cartId }] = useCartContext();

    const [
        addConfigurableProductToCart,
        { error: errorAddingConfigurableProduct }
    ] = useMutation(addConfigurableProductToCartMutation);

    const handleAddToCart = useCallback(
        async formValues => {
            const { quantity } = formValues;
            const payload = {
                item: loading || !data ? [] : data.products.items[0],
                productType,
                quantity: productQuantity
            };

            if (isSupportedProductType) {
                const variables = {
                    cartId,
                    parentSku:
                        payload.item.length < 1
                            ? 'No sku'
                            : payload.item.orParentSku,
                    product: payload.item,
                    quantity: payload.quantity,
                    sku: payload.item.length < 1 ? 'No sku' : payload.item.sku
                };

                if (productType === 'SimpleProduct') {
                    try {
                        await addConfigurableProductToCart({
                            variables
                        });
                    } catch {
                        return;
                    }
                } else if (productType === 'ConfigurableProduct') {
                    return;
                }
            } else {
                console.error('Unsupported product type. Cannot add to cart.');
            }
        },
        [
            addConfigurableProductToCart,
            cartId,
            isSupportedProductType,
            data,
            loading,
            productType,
            productQuantity
        ]
    );

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([errorAddingConfigurableProduct]),
        [errorAddingConfigurableProduct]
    );

    return {
        wishlistButtonProps,
        errorMessage: derivedErrorMessage,
        handleAddToCart,
        cartId,
        loading,
        fetchedData: !data ? null : data,
        error
    };
};
