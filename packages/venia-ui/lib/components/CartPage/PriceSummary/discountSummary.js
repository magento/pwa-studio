import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';
import { useStyle } from '../../../classify';
import Icon from '../../Icon';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';
import defaultClasses from './discountSummary.module.css';
import AnimateHeight from 'react-animate-height';
import { useDiscountSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/useDiscountSummary';

const MINUS_SYMBOL = '-';

/**
 * A component that renders the discount summary line item.
 *
 * @param {Object} props.classes
 * @param {Object} props.data fragment response data
 */
const DiscountSummary = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const {
        totalDiscount,
        discountData,
        expanded,
        handleClick
    } = useDiscountSummary(props);

    const toggleDiscountsAriaLabel = expanded
        ? formatMessage({
              id: 'priceSummary.discountSummary.hideDiscounts',
              defaultMessage: 'Hide individual discounts.'
          })
        : formatMessage({
              id: 'priceSummary.discountSummary.showDiscounts',
              defaultMessage: 'Show individual discounts.'
          });

    const iconSrc = expanded ? ArrowUp : ArrowDown;

    const individualDiscounts = discountData ? (
        <AnimateHeight duration={500} height={expanded ? 'auto' : 0}>
            <ul
                className={classes.individualDiscountsList}
                data-cy="DiscountSummary-IndividualDiscount"
            >
                <hr className={classes.individualDiscountSeparator} />
                {discountData.map(discount => {
                    if (discount.label != 'Gift Cards') {
                        return (
                            <li
                                className={
                                    classes.individualDiscountsListLineItem
                                }
                                key={discount.label}
                            >
                                <span
                                    className={classes.lineItemLabel}
                                    data-cy="DiscountSummary-IndividualDiscount-Label"
                                >
                                    <span data-cy="DiscountSummary-IndividualDiscount-DiscountLabel">
                                        {discount.label}
                                    </span>
                                </span>
                                <span
                                    data-cy="DiscountSummary-IndividualDiscount-DiscountValue"
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
                    }
                })}
                <hr className={classes.individualDiscountSeparator} />
            </ul>
        </AnimateHeight>
    ) : null;

    return totalDiscount.value ? (
        <Fragment>
            <li className={classes.discountLineItems}>
                <span
                    className={classes.discountLineItemLabel}
                    data-cy="PriceSummary-DiscountSummary-Label"
                >
                    <FormattedMessage
                        id={'discountSummary.lineItemLabel'}
                        defaultMessage={'Applied discounts'}
                    />
                    <button
                        onClick={handleClick}
                        data-cy="DiscountSummary-DiscountValue-TriggerButton"
                        type="button"
                        aria-expanded={expanded}
                        aria-label={toggleDiscountsAriaLabel}
                        className={classes.discountsButton}
                    >
                        <Icon src={iconSrc} />
                    </button>
                </span>
                <span
                    data-cy="DiscountSummary-discountValue"
                    className={classes.price}
                >
                    {MINUS_SYMBOL}
                    <Price
                        value={totalDiscount.value}
                        currencyCode={totalDiscount.currency}
                    />
                </span>
            </li>
            {individualDiscounts}
        </Fragment>
    ) : null;
};

export default DiscountSummary;
