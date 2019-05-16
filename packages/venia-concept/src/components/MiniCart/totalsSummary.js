import React from 'react';
import { number, object, shape, string } from 'prop-types';

import { Price } from '@magento/peregrine';

const TotalsSummary = props => {
    // Props.
    const { cart, classes } = props;

    // Members.
    const cartCurrencyCode = cart.details.currency.quote_currency_code;
    const cartId = cart.details.id;
    const hasSubtotal = cartId && cart.totals && 'subtotal' in cart.totals;
    const itemsQuantity = cart.details.items_qty;
    const itemQuantityText = itemsQuantity === 1 ? 'item' : 'items';
    const totalPrice = cart.totals.subtotal;

    return (
        <div className={classes.summary}>
            {hasSubtotal && (
                <dl className={classes.totals}>
                    <dt className={classes.subtotalLabel}>
                        <span>
                            Cart Total :&nbsp;
                            <Price
                                currencyCode={cartCurrencyCode}
                                value={totalPrice}
                            />
                        </span>
                    </dt>
                    <dd className={classes.subtotalValue}>
                        ({itemsQuantity} {itemQuantityText})
                    </dd>
                </dl>
            )}
        </div>
    );
};

TotalsSummary.propTypes = {
    cart: shape({
        details: shape({
            currency: object,
            id: number,
            items_qty: number,
            totals: object
        })
    }),
    classes: shape({
        subtotalLabel: string,
        subtotalValue: string,
        summary: string,
        totals: string
    })
};

export default TotalsSummary;
