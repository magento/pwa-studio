import React from 'react';
import gql from 'graphql-tag';
import { Price } from '@magento/peregrine';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import Button from '../../Button';
import { mergeClasses } from '../../../classify';
import defaultClasses from './priceSummary.css';

import DiscountSummary, { DiscountSummaryFragment } from './discountSummary';
import GiftCardSummary, { GiftCardSummaryFragment } from './giftCardSummary';
import ShippingSummary, { ShippingSummaryFragment } from './shippingSummary';
import TaxSummary, { TaxSummaryFragment } from './taxSummary';

/**
 * A component that fetches and renders cart data including:
 *  - subtotal
 *  - discounts applied
 *  - gift cards applied
 *  - estimated tax
 *  - estimated shipping
 *  - estimated total
 */
const PriceSummary = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const talonProps = usePriceSummary({
        query: PriceSummaryQuery
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
export const PriceSummaryQuery = gql`
    query getPriceSummary($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            items {
                quantity
            }
            ...ShippingSummaryFragment
            prices {
                ...TaxSummaryFragment
                ...DiscountSummaryFragment
                grand_total {
                    currency
                    value
                }
                subtotal_excluding_tax {
                    currency
                    value
                }
            }
            ...GiftCardSummaryFragment
        }
    }
    ${ShippingSummaryFragment}
    ${TaxSummaryFragment}
    ${DiscountSummaryFragment}
    ${GiftCardSummaryFragment}
`;

export default PriceSummary;
