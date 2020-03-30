import React from 'react';
import gql from 'graphql-tag';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';
/**
 * Reduces applied tax amounts into a single amount.
 *
 * @param {Array} applied_taxes
 */
const getEstimatedTax = (applied_taxes = []) => {
    return {
        currency: applied_taxes[0].amount.currency,
        value: applied_taxes.reduce((acc, tax) => acc + tax.amount.value, 0)
    };
};

/**
 * A component that renders the tax summary line item.
 *
 * @param {Object} props.classes
 * @param {Object} props.data query response data
 */
const TaxSummary = props => {
    const classes = mergeClasses({}, props.classes);
    const { data, isCheckout } = props;

    // Don't render estimated taxes until an address has been provided which
    // causes the server to apply a tax value to the cart.
    if (!data.length) {
        return null;
    }

    const tax = getEstimatedTax(props.data);

    return (
        <>
            <span className={classes.lineItemLabel}>
                {isCheckout ? 'Tax' : 'Estimated Tax'}
            </span>
            <span className={classes.price}>
                <Price value={tax.value} currencyCode={tax.currency} />
            </span>
        </>
    );
};

export const TaxSummaryFragment = gql`
    fragment TaxSummaryFragment on CartPrices {
        applied_taxes {
            amount {
                currency
                value
            }
        }
    }
`;

export default TaxSummary;
