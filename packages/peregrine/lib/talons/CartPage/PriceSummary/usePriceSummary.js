import { useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

/**
 * Flattens query data into a simple object. We create this here rather than
 * having each line summary line component destructure its own data because
 * only the parent "price summary" component knows the data structure.
 *
 * @param {Object} data query data
 */
const flattenData = data => {
    if (!data) return {};
    return {
        subtotal: data.cart.prices.subtotal_excluding_tax,
        total: data.cart.prices.grand_total,
        discounts: data.cart.prices.discounts,
        giftCards: data.cart.applied_gift_cards,
        taxes: data.cart.prices.applied_taxes,
        shipping: data.cart.shipping_addresses
    };
};

export const usePriceSummary = props => {
    const [{ cartId }] = useCartContext();

    const [fetchPriceSummary, { error, loading, data }] = useLazyQuery(
        props.query
    );

    useEffect(() => {
        if (cartId) {
            fetchPriceSummary({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchPriceSummary]);

    const handleProceedToCheckout = useCallback(() => {
        // TODO: Navigate to checkout view
    }, []);

    useEffect(() => {
        if (error) {
            console.error('GraphQL Error:', error);
        }
    }, [error]);

    return {
        handleProceedToCheckout,
        hasError: !!error,
        hasItems: data && !!data.cart.items.length,
        isLoading: !!loading,
        flatData: flattenData(data)
    };
};
