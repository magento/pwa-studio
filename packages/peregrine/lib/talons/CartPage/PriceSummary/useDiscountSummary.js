import { useCallback, useState } from 'react';

const DEFAULT_AMOUNT = {
    currency: 'USD',
    value: 0
};

/**
 * Reduces discounts array into a single amount.
 *
 * @param {Array} discounts
 */
const getTotalDiscount = (discounts = []) => {
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
 * This talon contains the logic for the discount summary component.
 *
 * @param {Object} props
 * @param {Array} props.data Discount data
 * @returns {DiscountSummaryProps}
 */
export const useDiscountSummary = props => {
    const { data: discountData } = props;

    const totalDiscount = getTotalDiscount(discountData);

    const [expanded, setExpanded] = useState(false);

    const handleClick = useCallback(() => {
        setExpanded(value => !value);
    }, [setExpanded]);

    return {
        totalDiscount,
        discountData,
        expanded,
        handleClick
    };
};

/** JSDocs type definitions */

/**
 * @typedef {Object} DiscountSummaryProps
 *
 * @property {DiscountObject} discount Object containing discount information
 * @property {Array} discountData Array of discounts
 * @property {Boolean} expanded
 * @property {Function} handleClick Click handler for toggling the expanded state
 *
 */

/**
 * @typedef {Object} DiscountObject
 *
 * @property {String} currency Currency code
 * @property {Number} value Discount amount
 */
