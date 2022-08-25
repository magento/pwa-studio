import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '../../../classify';

const MINUS_SYMBOL = '-';

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
            currency: cards[0].applied_balance.currency,
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
    const classes = useStyle({}, props.classes);
    const cards = getGiftCards(props.data);

    return cards.value ? (
        <Fragment>
            <span
                className={classes.lineItemLabel}
                data-cy="PriceSummary-GiftCardSummary-label"
            >
                <FormattedMessage
                    id={'giftCardSummary.lineItemLabel'}
                    defaultMessage={'Gift Card(s) applied'}
                />
            </span>
            <span className={classes.price}>
                {MINUS_SYMBOL}
                <Price value={cards.value} currencyCode={cards.currency} />
            </span>
        </Fragment>
    ) : null;
};
