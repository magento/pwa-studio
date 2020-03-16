import React from 'react';
import gql from 'graphql-tag';
import { Price } from '@magento/peregrine';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import Button from '../../Button';
import { mergeClasses } from '../../../classify';
import defaultClasses from './priceSummary.css';
import DiscountSummary from './discountSummary';
import GiftCardSummary from './giftCardSummary';
import ShippingSummary from './shippingSummary';
import TaxSummary from './taxSummary';
import { PriceSummaryFragment } from './priceSummaryFragments';

const GET_PRICE_SUMMARY = gql`
    query getPriceSummary($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...PriceSummaryFragment
        }
    }
    ${PriceSummaryFragment}
`;

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
    const { isCartUpdating } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const talonProps = usePriceSummary({
        queries: {
            getPriceSummary: GET_PRICE_SUMMARY
        }
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

    const priceClass = isCartUpdating ? classes.priceUpdating : classes.price;
    const totalPriceClass = isCartUpdating
        ? classes.priceUpdating
        : classes.totalPrice;

    return (
        <div className={classes.root}>
            <div className={classes.lineItems}>
                <span className={classes.lineItemLabel}>{'Subtotal'}</span>
                <span className={priceClass}>
                    <Price
                        value={subtotal.value}
                        currencyCode={subtotal.currency}
                    />
                </span>
                <DiscountSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={discounts}
                />
                <GiftCardSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={giftCards}
                />
                <TaxSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={taxes}
                />
                <ShippingSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={shipping}
                />
                <span className={classes.totalLabel}>{'Estimated Total'}</span>
                <span className={totalPriceClass}>
                    <Price value={total.value} currencyCode={total.currency} />
                </span>
            </div>
            <div className={classes.checkoutButton_container}>
                <Button priority={'high'} onClick={handleProceedToCheckout}>
                    {'Proceed to Checkout'}
                </Button>
            </div>
        </div>
    );
};

export default PriceSummary;
