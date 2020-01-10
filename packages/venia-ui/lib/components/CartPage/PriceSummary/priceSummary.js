import React from 'react';
import gql from 'fraql';
import { Price } from '@magento/peregrine';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import Button from '../../Button';
import { mergeClasses } from '../../../classify';
import defaultClasses from './priceSummary.css';

import DiscountSummary from './discountSummary';
import GiftCardSummary from './giftCardSummary';
import ShippingSummary from './shippingSummary';
import TaxSummary from './taxSummary';

// Use fraql to compose inline, unnamed fragments.
// https://github.com/apollographql/graphql-tag/issues/237
const GET_PRICE_SUMMARY = gql`
    query getPriceSummary($cartId: String!) {
        cart(cart_id: $cartId) {
            items {
                quantity
            }
            ${ShippingSummary.fragment}
            prices {
                ${TaxSummary.fragment}
                ${DiscountSummary.fragment}
                grand_total {
                    currency
                    value
                }
                subtotal_excluding_tax {
                    currency
                    value
                }
            }
            ${GiftCardSummary.fragment}
        }
    }
`;

/**
 * A component that fetches and renders cart data including:
 *  - subtotal
 *  - coupons applied
 *  - gift cards applied
 *  - estimated tax
 *  - estimated shipping
 *  - estimated total
 */
const PriceSummary = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const talonProps = usePriceSummary({
        query: GET_PRICE_SUMMARY
    });

    const {
        handleProceedToCheckout,
        hasError,
        hasItems,
        isLoading,
        data
    } = talonProps;

    if (hasError) {
        return (
            <div className={classes.root}>
                An error occurred. Please refresh the page.
            </div>
        );
    } else if (!hasItems || isLoading) {
        return null;
    }

    const subtotal = data.cart.prices.subtotal_excluding_tax;
    const total = data.cart.prices.grand_total;

    return (
        <div className={classes.root}>
            <div className={classes.lineItems}>
                <span className={classes.lineItemLabel}>{'Subtotal'}</span>
                <span className={classes.price}>
                    <Price
                        value={subtotal.value}
                        currencyCode={subtotal.currency}
                    />
                </span>
                <DiscountSummary classes={classes} data={data} />
                <GiftCardSummary classes={classes} data={data} />
                <TaxSummary classes={classes} data={data} />
                <ShippingSummary classes={classes} data={data} />
                <span className={classes.totalLabel}>{'Estimated Total'}</span>
                <span className={classes.totalPrice}>
                    <Price value={total.value} currencyCode={total.currency} />
                </span>
            </div>
            <div className={classes.checkoutButton_container}>
                <Button priority={'high'} onClick={handleProceedToCheckout}>
                    {'PROCEED TO CHECKOUT'}
                </Button>
            </div>
        </div>
    );
};

export default PriceSummary;
