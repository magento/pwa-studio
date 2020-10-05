import React from 'react';
import { arrayOf, string, shape, number } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Price } from '@magento/peregrine';

import defaultClasses from './orderTotal.css';

const DEFAULT_AMOUNT = {
    currency: 'USD',
    value: 0
};

/**
 * Reduces discounts array into a single amount.
 *
 * @param {Array} discounts
 */
const getDiscount = (discounts = []) => {
    // discounts from data can be null
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

const OrderTotal = props => {
    const { classes: propClasses, data } = props;
    const {
        discounts,
        grand_total,
        subtotal,
        total_tax,
        total_shipping
    } = data;
    const classes = mergeClasses(defaultClasses, propClasses);
    const totalDiscount = getDiscount(discounts);

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <FormattedMessage
                    id="orderTotal.orderTotal"
                    defaultMessage="Order Total"
                />
            </div>
            <div className={classes.subTotal}>
                <span>
                    <FormattedMessage
                        id="orderTotal.subtotal"
                        defaultMessage="Subtotal"
                    />
                </span>
                <span>
                    <Price
                        value={subtotal.value}
                        currencyCode={subtotal.currency}
                    />
                </span>
            </div>
            <div className={classes.discount}>
                <span>
                    <FormattedMessage
                        id="orderTotal.discount"
                        defaultMessage="Discount"
                    />
                </span>
                <span>
                    <Price
                        value={totalDiscount.value}
                        currencyCode={totalDiscount.currency}
                    />
                </span>
            </div>
            <div className={classes.tax}>
                <span>
                    <FormattedMessage
                        id="orderTotal.tax"
                        defaultMessage="Tax"
                    />
                </span>
                <span>
                    <Price
                        value={total_tax.value}
                        currencyCode={total_tax.currency}
                    />
                </span>
            </div>
            <div className={classes.shipping}>
                <span>
                    <FormattedMessage
                        id="orderTotal.shipping"
                        defaultMessage="Shipping"
                    />
                </span>
                <span>
                    <Price
                        value={total_shipping.value}
                        currencyCode={total_shipping.currency}
                    />
                </span>
            </div>
            <div className={classes.total}>
                <span>
                    <FormattedMessage
                        id="orderTotal.total"
                        defaultMessage="Total"
                    />
                </span>
                <span>
                    <Price
                        value={grand_total.value}
                        currencyCode={grand_total.currency}
                    />
                </span>
            </div>
        </div>
    );
};

export default OrderTotal;

OrderTotal.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        subTotal: string,
        discount: string,
        tax: string,
        shipping: string,
        total: string
    }),
    data: shape({
        discounts: arrayOf(
            shape({
                amount: shape({
                    currency: string,
                    value: number
                })
            })
        ),
        grand_total: shape({
            currency: string,
            value: number
        }),
        subtotal: shape({
            currency: string,
            value: number
        }),
        total_tax: shape({
            currency: string,
            value: number
        }),
        total_shipping: shape({
            currency: string,
            value: number
        })
    })
};
