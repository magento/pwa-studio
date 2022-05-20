import { isSupportedProductType as isSupported } from '@magento/peregrine/lib/util/isSupportedProductType';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import { useCallback, useEffect, useRef } from 'react';
import useIntersectionObserver from '@magento/peregrine/lib/hooks/useIntersectionObserver';

export const useGalleryItem = (props = {}) => {
    const [, { dispatch }] = useEventingContext();
    const intersectionObserver = useIntersectionObserver();
    const { item, storeConfig } = props;
    const itemRef = useRef(null);

    const finalPrice = item?.price_range?.maximum_price?.final_price?.value;
    const discountAmount =
        item?.price_range?.maximum_price?.discount?.amount_off;
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
        if (typeof intersectionObserver === 'undefined' || !item) {
            return;
        }
        const htmlElement = itemRef.current;
        const onIntersection = entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                observer.unobserve(htmlElement);
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
        };
        const observer = new intersectionObserver(onIntersection);
        observer.observe(htmlElement);
        return () => {
            if (htmlElement) {
                observer.unobserve(htmlElement);
            }
        };
    }, [
        currencyCode,
        discountAmount,
        dispatch,
        finalPrice,
        intersectionObserver,
        item
    ]);

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
        itemRef,
        handleLinkClick,
        wishlistButtonProps,
        isSupportedProductType
    };
};
