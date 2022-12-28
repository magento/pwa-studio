import React, { useMemo } from 'react';
import { arrayOf, string, shape, number } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Price from '@magento/venia-ui/lib/components/Price';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './orderTotal.module.css';
import Button from '@magento/venia-ui/lib/components/Button';

const OrderTotal = props => {
    const { classes: propClasses, data, items } = props;
    const { discounts, grand_total, subtotal, total_shipping } = data;
    const classes = useStyle(defaultClasses, propClasses);

    const discountRowElement = useMemo(() => {
        if (!discounts || !discounts.length) {
            return null;
        }

        const discountTotal = {
            currency: discounts[0].amount.currency,
            value: discounts.reduce((acc, discount) => acc + discount.amount.value, 0)
        };

        return (
            <div className={classes.discount}>
                <span>
                    <FormattedMessage id="orderDetails.discount" defaultMessage="Discount" />
                </span>
                <span>
                    <Price value={discountTotal.value} currencyCode={discountTotal.currency} />
                </span>
            </div>
        );
    }, [classes.discount, discounts]);

    return (
        <div className={classes.root}>
            <h3 className={classes.heading}>
                <FormattedMessage id="orderItems.Summary" defaultMessage="Summary" />
            </h3>
            <div className={classes.detailsContainer}>
                <div>
                    <span className={classes.supploerText}>Supplier 1</span>
                    <span className={classes.itemsText}>Items: {items?.length}</span>
                </div>
                <div>
                    <div className={classes.priceDetails}>
                        <div>
                            <span className={classes.priceNet}>Price net:</span>
                            <span>
                                <Price value={subtotal.value} currencyCode={subtotal.currency} />
                            </span>
                        </div>
                        <div className={classes.grossText}>
                            <span>Price gross:</span>
                            <span>
                                <Price value={total_shipping.value} currencyCode={total_shipping.currency} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.actionsWrapper}>
                <div className={classes.subTotal}>
                    <span>
                        <FormattedMessage id="orderDetails.priceNet" defaultMessage="Price net" />
                    </span>
                    <span>
                        <Price value={subtotal.value} currencyCode={subtotal.currency} />
                    </span>
                </div>
                {discountRowElement}
                <div className={classes.total}>
                    <span>
                        <FormattedMessage id="orderDetails.totalPrice:" defaultMessage="Total price:" />
                    </span>
                    <span>
                        <Price value={grand_total.value} currencyCode={grand_total.currency} />
                    </span>
                </div>
            </div>
            <div className={classes.actionsWrapper}>
                <Button priority="high">Go to checkout</Button>
                <Button className={classes.shoppngBtn} priority="normal">
                    Go back to shopping
                </Button>
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
