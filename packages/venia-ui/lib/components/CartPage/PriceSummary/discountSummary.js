import React, { Fragment, useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';
import { useStyle } from '../../../classify';
import Icon from '../../Icon';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';

const MINUS_SYMBOL = '-';

const DEFAULT_AMOUNT = {
    currency: 'USD',
    value: 0
};

/**
 * Reduces discounts array into a single amount.
 *
 * @param {Array} discounts
 */
const getDiscount = (discounts = []) => {
    // discounts from data can be null
    if (!discounts || !discounts.length) {
        return DEFAULT_AMOUNT;
    } else {
        return {
            currency: discounts[0].amount.currency,
            value: discounts.reduce(
                (acc, discount) => acc + discount.amount.value,
                0
            )
        };
    }
};

/**
 * A component that renders the discount summary line item.
 *
 * @param {Object} props.classes
 * @param {Object} props.data fragment response data
 */
const DiscountSummary = props => {
    const classes = useStyle({}, props.classes);
    const discount = getDiscount(props.data);
    const discountData = props.data;
    const { formatMessage } = useIntl();
    const [isExpanded, setExpanded] = useState(false);
    const handleClick = useCallback(() => {
        setExpanded(value => !value);
    }, [setExpanded]);
    const toggleDiscountsAriaLabel = isExpanded
        ? formatMessage({
              id: 'priceSummary.discountSummary.hideDiscounts',
              defaultMessage: 'Hide individual discounts.'
          })
        : formatMessage({
              id: 'priceSummary.discountSummary.showDiscounts',
              defaultMessage: 'Show individual discounts.'
          });
    const iconSrc = isExpanded ? ArrowUp : ArrowDown;
    const discounts =
        isExpanded && discountData
            ? discountData.map(discount => {
                  return (
                      <li className={classes.lineItems} key={discount.label}>
                          <span
                              className={classes.lineItemLabel}
                              data-cy="PriceSummary-DiscountSummary-label"
                          >
                              <span data-cy="DiscountSummary-DiscountLabel">
                                  {discount.label}
                              </span>
                          </span>
                          <span
                              data-cy="DiscountSummary-DiscountValue"
                              className={classes.price}
                          >
                              {MINUS_SYMBOL}
                              <Price
                                  value={discount.amount.value}
                                  currencyCode={discount.amount.currency}
                              />
                          </span>
                      </li>
                  );
              })
            : null;

    return discount.value ? (
        <Fragment>
            <li className={classes.lineItems}>
                <span
                    className={classes.lineItemLabel}
                    data-cy="PriceSummary-DiscountSummary-Label"
                >
                    <FormattedMessage
                        id={'discountSummary.lineItemLabel'}
                        defaultMessage={'Discounts applied'}
                    />
                    <button
                        onClick={handleClick}
                        data-cy="DiscountSummary-DiscountValue-TriggerButton"
                        type="button"
                        aria-expanded={isExpanded}
                        aria-label={toggleDiscountsAriaLabel}
                    >
                        <Icon src={iconSrc} size={16} />
                    </button>
                </span>
                <span
                    data-cy="DiscountSummary-discountValue"
                    className={classes.price}
                >
                    {MINUS_SYMBOL}
                    <Price
                        value={discount.value}
                        currencyCode={discount.currency}
                    />
                </span>
            </li>
            {discounts}
        </Fragment>
    ) : null;
};

export default DiscountSummary;
