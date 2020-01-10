import React from 'react';
import gql from 'fraql';
import { Price } from '@magento/peregrine';

const DEFAULT_AMOUNT = {
    currency: 'USD', // TODO: better default
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
const GiftCardSummary = props => {
    const { classes } = props;

    const cards = getGiftCards(props.data);

    return cards.value ? (
        <>
            <span className={classes.lineItemLabel}>
                {'Gift Card(s) applied'}
            </span>
            <span className={classes.price}>
                {'(-'}
                <Price value={cards.value} currencyCode={cards.currency} />
                {')'}
            </span>
        </>
    ) : null;
};

// TODO: Gift cards are only enabled in EE, write a build time tool that turns the component into a no-op and the static fragments into __typename requests.
const IS_EE = false;

GiftCardSummary.fragments = {
    applied_gift_cards: IS_EE
        ? gql`
              fragment _ on Cart {
                  applied_gift_cards {
                      applied_balance {
                          value
                          currency
                      }
                  }
              }
          `
        : gql`
              fragment _ on Cart {
                  __typename
              }
          `
};

export default GiftCardSummary;
