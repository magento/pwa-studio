import React from 'react';
import gql from 'fraql';
import { Price } from '@magento/peregrine';

// TODO: v2.3.4 supports "discounts", v2.3.3 supports "discount". Just another place where a build plugin can swap based on schema type availablility
const IS_234 = false;

const DiscountSummary = props => {
    const { classes, data } = props;
    // TODO: useDiscount talon for parsing non-normalized data.
    return (
        <>
            {data.value ? (
                <>
                    <span className={classes.lineItemLabel}>{'Discount'}</span>
                    <span className={classes.price}>
                        {'(-'}
                        <Price
                            value={discount.value}
                            currencyCode={discount.currency}
                        />
                        {')'}
                    </span>
                </>
            ) : null}
        </>
    );
};

DiscountSummary.fragments = {
    discounts: IS_234
        ? gql`
              fragment _ on CartPrices {
                  discounts {
                      amount {
                          currency
                          value
                      }
                  }
              }
          `
        : gql`
              fragment _ on CartPrices {
                  discount {
                      amount {
                          currency
                          value
                      }
                  }
              }
          `
};

export default DiscountSummary;
