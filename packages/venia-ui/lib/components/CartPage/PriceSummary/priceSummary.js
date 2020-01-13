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
            ${ShippingSummary.fragments.shipping_addresses}
            prices {
                ${TaxSummary.fragments.applied_taxes}
                ${DiscountSummary.fragments.discounts}
                grand_total {
                    currency
                    value
                }
                subtotal_excluding_tax {
                    currency
                    value
                }
            }
            ${GiftCardSummary.fragments.applied_gift_cards}
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
    const discountData = data.cart.prices.discounts;
    const giftCardData = data.cart.applied_gift_cards;
    const taxData = data.cart.prices.applied_taxes;
    const shippingData = data.cart.shipping_addresses;
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
                <DiscountSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={discountData}
                />
                <GiftCardSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={giftCardData}
                />
                <TaxSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={taxData}
                />
                <ShippingSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={shippingData}
                />
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
