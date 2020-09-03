import React, { Fragment } from 'react';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';

const DEFAULT_AMOUNT = {
    currency: 'USD',
    value: 0
};

/**
 * Reduces applied gift card amounts into a single amount.
 *
 * @param {Array} cards
 */
const getGiftCards = (cards = []) => {
    if (!cards.length) {
        return DEFAULT_AMOUNT;
    } else {
        return {
            currency: 'USD',
            value: cards.reduce(
                (acc, card) => acc + card.applied_balance.value,
                0
            )
        };
    }
};

/**
 * A component that renders the gift card summary line item.
 *
 * @param {Object} props.classes
 * @param {Object} props.data fragment response data
 */

export default props => {
    const classes = mergeClasses({}, props.classes);
    const cards = getGiftCards(props.data);

    return cards.value ? (
        <Fragment>
            <span className={classes.lineItemLabel}>
                {'Gift Card(s) applied'}
            </span>
            <span className={classes.price}>
                {'-'}
                <Price value={cards.value} currencyCode={cards.currency} />
            </span>
        </Fragment>
    ) : null;
};
