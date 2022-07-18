import { useCallback, useMemo, useEffect } from 'react';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import resourceUrl from '../../util/makeUrl';

/**
 * Return props necessary to render a SuggestedProduct component.
 *
 * @param {Object} props
 * @param {Object} props.price_range - price range
 * @param {String} props.url_key - url key
 * @param {String} props.url_suffix - url suffix
 * @param {String} props.sku - product sky
 * @param {Function} props.onNavigate - callback to fire on link click
 */
export const useSuggestedProduct = props => {
    const [, { dispatch }] = useEventingContext();
    const {
        name,
        price,
        price_range,
        onNavigate,
        url_key,
        url_suffix,
        sku
    } = props;

    const finalPrice = price_range?.maximum_price?.final_price?.value;
    const discountAmount = price_range?.maximum_price?.discount?.amount_off;
    const currencyCode = price_range?.maximum_price?.final_price?.currency;

    const handleClick = useCallback(() => {
        dispatch({
            type: 'PRODUCT_CLICK',
            payload: {
                name,
                sku,
                priceTotal: finalPrice,
                discountAmount,
                currencyCode,
                selectedOptions: null
            }
        });
        if (typeof onNavigate === 'function') {
            onNavigate();
        }
    }, [
        name,
        currencyCode,
        discountAmount,
        dispatch,
        finalPrice,
        onNavigate,
        sku
    ]);

    useEffect(() => {
        if (sku !== null) {
            dispatch({
                type: 'PRODUCT_IMPRESSION',
                payload: {
                    name,
                    sku,
                    priceTotal: finalPrice,
                    discountAmount,
                    currencyCode,
                    selectedOptions: null
                }
            });
        }
    }, [name, currencyCode, discountAmount, dispatch, finalPrice, sku]);

    // fall back to deprecated field if price range is unavailable
    const priceProps = useMemo(() => {
        return {
            currencyCode:
                price_range?.maximum_price?.final_price?.currency ||
                price.regularPrice.amount.currency,
            value:
                price_range?.maximum_price?.final_price?.value ||
                price.regularPrice.amount.value
        };
    }, [
        price.regularPrice.amount.currency,
        price.regularPrice.amount.value,
        price_range?.maximum_price?.final_price?.currency,
        price_range?.maximum_price?.final_price?.value
    ]);

    const uri = useMemo(() => resourceUrl(`/${url_key}${url_suffix || ''}`), [
        url_key,
        url_suffix
    ]);

    return {
        priceProps,
        handleClick,
        uri
    };
};
