import React from 'react';
import { number, object, shape, string } from 'prop-types';

import { Price } from '@magento/peregrine';

import { mergeClasses } from 'src/classify';

import defaultClasses from './totalsSummary.css';

const TotalsSummary = props => {
    // Props.
    const { cart } = props;

    // Members.
    const cartCurrencyCode = cart.details.currency.quote_currency_code;
    const classes = mergeClasses(defaultClasses, props.classes);
    const hasSubtotal = cart.totals && 'subtotal' in cart.totals;
    const itemsQuantity = cart.details.items_qty;
    const itemQuantityText = itemsQuantity === 1 ? 'item' : 'items';
    const totalPrice = cart.totals.subtotal;

    return (
        <div className={classes.root}>
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
            items_qty: number,
            totals: object
        }).isRequired
    }),
    classes: shape({
        root: string,
        subtotalLabel: string,
        subtotalValue: string,
        totals: string
    })
};

export default TotalsSummary;
