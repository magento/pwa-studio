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
        query: PriceSummary.queries.GET_PRICE_SUMMARY
    });

    const {
        handleProceedToCheckout,
        hasError,
        hasItems,
        isLoading,
        flatData
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

    const { subtotal, total, discounts, giftCards, taxes, shipping } = flatData;

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
                    data={discounts}
                />
                <GiftCardSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={giftCards}
                />
                <TaxSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={taxes}
                />
                <ShippingSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={shipping}
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

// queries exported as static member to be used by refetchQueries.
PriceSummary.queries = {
    GET_PRICE_SUMMARY: gql`
    query getPriceSummary($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            items {
                quantity
            }
            # Use fraql to compose inline, unnamed fragments...
            # https://github.com/apollographql/graphql-tag/issues/237
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
`
};

export default PriceSummary;
