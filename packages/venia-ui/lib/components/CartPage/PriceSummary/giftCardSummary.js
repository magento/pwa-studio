import React from 'react';
import gql from 'fraql';
import { Price } from '@magento/peregrine';

// TODO: Gift cards are only enabled in EE, write a build time tool that turns the component into a no-op and the static fragments into __typename requests.
const IS_EE = false;

const GiftCardSummary = props => {
    const { classes, data } = props;
    return (
        <>
            {data.value ? (
                <>
                    <span className={classes.lineItemLabel}>
                        {'Gift Card(s) applied'}
                    </span>
                    <span className={classes.price}>
                        {'(-'}
                        <Price
                            value={data.value}
                            currencyCode={data.currency}
                        />
                        {')'}
                    </span>
                </>
            ) : null}
        </>
    );
};

GiftCardSummary.fragments = {
    appliedGiftCards: IS_EE
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
