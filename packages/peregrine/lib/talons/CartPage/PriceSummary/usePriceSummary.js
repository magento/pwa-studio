import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import isObjectEmpty from '@magento/peregrine/lib/util/isObjectEmpty';

const DEFAULT_AMOUNT = {
    currency: 'USD', // TODO: better default
    value: 0
};

/**
 * Reduces discounts into a single amount.
 *
 * @param {Array} discounts
 */
const getDiscount = (discounts = []) => {
    if (!discounts || !discounts.length) {
        return DEFAULT_AMOUNT;
    } else {
        return {
            currency: discounts[0].amount.currency,
            value: discounts.reduce(
                (acc, discount) => acc + discount.amount.value,
                0
            )
        };
    }
};

/**
 * Reduces applied tax amounts into a single amount.
 *
 * @param {Array} applied_taxes
 */
const getEstimatedTax = (applied_taxes = []) => {
    if (!applied_taxes.length) {
        return DEFAULT_AMOUNT;
    } else {
        return {
            currency: applied_taxes[0].amount.currency,
            value: applied_taxes.reduce((acc, tax) => acc + tax.amount.value, 0)
        };
    }
};

/**
 * Reduces applied gift card amounts into a single amount.
 *
 * @param {Array} cards
 */
const getGiftCards = (cards = []) => {
    if (!cards.length) {
        return DEFAULT_AMOUNT;
    } else {
        return {
            currency: 'USD',
            value: cards.reduce(
                (acc, card) => acc + card.applied_balance.value,
                0
            )
        };
    }
};

// TODO: I'm confused as to why shipping_addresses is an array. If there are multiple shipping addresses how do we tell which one is the right one?
const getEstimatedShipping = (shipping_addresses = []) => {
    if (
        !shipping_addresses.length ||
        !shipping_addresses[0].selected_shipping_method
    ) {
        return DEFAULT_AMOUNT;
    } else {
        return shipping_addresses[0].selected_shipping_method.amount;
    }
};

const normalizeData = (dataFromGraphQL = {}) => {
    if (isObjectEmpty(dataFromGraphQL)) {
        return {
            subtotal: DEFAULT_AMOUNT,
            discount: DEFAULT_AMOUNT,
            tax: DEFAULT_AMOUNT,
            shipping: DEFAULT_AMOUNT,
            total: DEFAULT_AMOUNT
        };
    }
    return {
        subtotal: dataFromGraphQL.cart.prices.subtotal_excluding_tax,
        // TODO: Coupon value is returned in the `discounts` array but there may be other types of discounts and there is no way to identify them from one another.
        // TODO: "discounts" is allowed in 2.3.4, "discount" in 2.3.3, the following is gross but necessary for now since we don't know which gql requested. Could use a static export from the DiscountSummary to name it though.
        discount:
            dataFromGraphQL.cart.prices.discount ||
            getDiscount(dataFromGraphQL.cart.prices.discounts),
        giftCard: getGiftCards(dataFromGraphQL.cart.applied_gift_cards),
        tax: getEstimatedTax(dataFromGraphQL.cart.prices.applied_taxes),
        shipping: getEstimatedShipping(dataFromGraphQL.cart.shipping_addresses),
        total: dataFromGraphQL.cart.prices.grand_total
    };
};

export const usePriceSummary = props => {
    const [{ cartId }] = useCartContext();
    const { error, data } = useQuery(props.query, {
        variables: {
            cartId
        },
        fetchPolicy: 'no-cache'
    });

    const handleProceedToCheckout = useCallback(() => {
        // TODO: Navigate to checkout view
        console.log('Going to checkout!');
    }, []);

    useEffect(() => {
        if (error) {
            console.error('GraphQL Error:', error);
        }
    }, [error]);

    const normalizedData = useMemo(() => normalizeData(data), [data]);

    return {
        handleProceedToCheckout,
        hasError: !!error,
        hasItems: data && !!data.cart.items.length,
        normalizedData
    };
};
