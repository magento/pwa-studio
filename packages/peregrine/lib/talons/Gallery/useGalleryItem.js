import { isSupportedProductType as isSupported } from '@magento/peregrine/lib/util/isSupportedProductType';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import { useCallback, useEffect } from 'react';

export const useGalleryItem = (props = {}) => {
    const [, { dispatch }] = useEventingContext();
    const { item, storeConfig } = props;

    const finalPrice = item?.price_range?.maximum_price?.final_price?.value;
    const regularPrice = item?.price_range?.maximum_price?.regular_price?.value;
    const discountAmount =
        regularPrice !== null ? regularPrice - finalPrice : 0;
    const currencyCode =
        item?.price_range?.maximum_price?.final_price?.currency;

    const handleLinkClick = useCallback(() => {
        dispatch({
            type: 'PRODUCT_CLICK',
            payload: {
                sku: item.sku,
                priceTotal: finalPrice,
                discountAmount,
                currencyCode,
                selectedOptions: null
            }
        });
    }, [currencyCode, discountAmount, dispatch, finalPrice, item]);

    useEffect(() => {
        if (item) {
            dispatch({
                type: 'PRODUCT_IMPRESSION',
                payload: {
                    sku: item.sku,
                    priceTotal: finalPrice,
                    discountAmount,
                    currencyCode,
                    selectedOptions: null
                }
            });
        }
    }, [currencyCode, discountAmount, dispatch, finalPrice, item]);

    const productType = item ? item.__typename : null;

    const isSupportedProductType = isSupported(productType);

    const wishlistButtonProps =
        storeConfig && storeConfig.magento_wishlist_general_is_enabled === '1'
            ? {
                  item: {
                      sku: item.sku,
                      quantity: 1
                  },
                  storeConfig
              }
            : null;

    return {
        ...props,
        handleLinkClick,
        wishlistButtonProps,
        isSupportedProductType
    };
};
