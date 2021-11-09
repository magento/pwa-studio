import React from 'react';
import { number, shape, string } from 'prop-types';

import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '../../classify';

import defaultClasses from './totalsSummary.module.css';

const cartTotalString = 'Cart Total : ';

const TotalsSummary = props => {
    // Props.
    const { currencyCode, numItems, subtotal } = props;

    // Members.
    const classes = useStyle(defaultClasses, props.classes);
    const hasSubtotal = Boolean(subtotal);
    const numItemsText = numItems === 1 ? 'item' : 'items';
    const subtotalValueString = `(${numItems} ${numItemsText})`;

    return (
        <div className={classes.root}>
            {hasSubtotal && (
                <dl className={classes.totals}>
                    <dt className={classes.subtotalLabel}>
                        <span>
                            {cartTotalString}
                            <Price currency={currencyCode} value={subtotal} />
                        </span>
                    </dt>
                    <dd className={classes.subtotalValue}>
                        {subtotalValueString}
                    </dd>
                </dl>
            )}
        </div>
    );
};

TotalsSummary.propTypes = {
    classes: shape({
        root: string,
        subtotalLabel: string,
        subtotalValue: string,
        totals: string
    }),
    currencyCode: string,
    numItems: number,
    subtotal: number
};

export default TotalsSummary;
