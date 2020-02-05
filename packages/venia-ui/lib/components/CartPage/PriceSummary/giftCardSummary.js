import React from 'react';
import gql from 'graphql-tag';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';

/**
 * Gift cards are an EE feature and we need some way to conditionally include
 * this code and query in bundled assets. For now, this constant will be the
 * toggle, but we may eventually need to do something like a build tool that can
 * check schema for existence of "applied_gift_cards" and include this component
 * if present.
 *
 * Right now, if `IS_EE == false`, this component returns a no-op, null function
 * as well as an "empty" fragment so as to not break the GQL query of a parent.
 *
 * TODO: Solve this problem. This local toggle should not be long-lived, at least not past PWA-78.
 */
const IS_EE = false;

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
const GiftCardSummary = IS_EE
    ? props => {
          const classes = mergeClasses({}, props.classes);
          const cards = getGiftCards(props.data);

          return cards.value ? (
              <>
                  <span className={classes.lineItemLabel}>
                      {'Gift Card(s) applied'}
                  </span>
                  <span className={classes.price}>
                      {'-'}
                      <Price
                          value={cards.value}
                          currencyCode={cards.currency}
                      />
                  </span>
              </>
          ) : null;
      }
    : () => null;

export const GiftCardSummaryFragment = IS_EE
    ? gql`
          fragment GiftCardSummaryFragment on Cart {
              id
              applied_gift_cards {
                  applied_balance {
                      value
                      currency
                  }
              }
          }
      `
    : gql`
          fragment GiftCardSummaryFragment on Cart {
              id
              __typename
          }
      `;

export default GiftCardSummary;
