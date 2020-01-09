import React from 'react';
import { Price } from '@magento/peregrine';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import Button from '../../Button';
import { mergeClasses } from '../../../classify';
import defaultClasses from './priceSummary.css';
import GET_PRICE_SUMMARY from '../../../queries/getPriceSummary.graphql';

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
        normalizedData
    } = talonProps;

    if (hasError) {
        return (
            <div className={classes.root}>
                An error occurred. Please refresh the page.
            </div>
        );
    } else if (!hasItems) {
        return null;
    }

    const {
        subtotal,
        discount,
        giftCard,
        tax,
        shipping,
        total
    } = normalizedData;

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
                {discount.value ? (
                    <>
                        <span className={classes.lineItemLabel}>
                            {'Discount'}
                        </span>
                        <span className={classes.price}>
                            {'(-'}
                            <Price
                                value={discount.value}
                                currencyCode={discount.currency}
                            />
                            {')'}
                        </span>
                    </>
                ) : null}
                {giftCard.value ? (
                    <>
                        <span className={classes.lineItemLabel}>
                            {'Gift Card(s) applied'}
                        </span>
                        <span className={classes.price}>
                            {'(-'}
                            <Price
                                value={giftCard.value}
                                currencyCode={giftCard.currency}
                            />
                            {')'}
                        </span>
                    </>
                ) : null}
                <span className={classes.lineItemLabel}>{'Estimated Tax'}</span>
                <span className={classes.price}>
                    <Price value={tax.value} currencyCode={tax.currency} />
                </span>
                <span className={classes.lineItemLabel}>
                    {'Estimated Shipping'}
                </span>
                <span className={classes.price}>
                    {shipping.value ? (
                        <Price
                            value={shipping.value}
                            currencyCode={shipping.currency}
                        />
                    ) : (
                        <span>{'FREE'}</span>
                    )}
                </span>
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
