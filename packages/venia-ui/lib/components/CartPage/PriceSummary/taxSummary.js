import React from 'react';
import gql from 'fraql';
import { Price } from '@magento/peregrine';

const DEFAULT_AMOUNT = {
    currency: 'USD',
    value: 0
};

/**
 * Reduces applied tax amounts into a single amount.
 *
 * @param {Array} applied_taxes
 */
const getEstimatedTax = (applied_taxes = []) => {
    if (!applied_taxes.length) {
        return DEFAULT_AMOUNT;
    } else {
        return {
            currency: applied_taxes[0].amount.currency,
            value: applied_taxes.reduce((acc, tax) => acc + tax.amount.value, 0)
        };
    }
};

/**
 * A component that renders the discount summary line item.
 *
 * @param {Object} props.classes
 * @param {Object} props.data query response data
 */
const TaxSummary = props => {
    const { classes } = props;

    const tax = getEstimatedTax(props.data);

    return (
        <>
            <span className={classes.lineItemLabel}>{'Estimated Tax'}</span>
            <span className={classes.price}>
                <Price value={tax.value} currencyCode={tax.currency} />
            </span>
        </>
    );
};

TaxSummary.fragments = {
    applied_taxes: gql`
        fragment _ on CartPrices {
            applied_taxes {
                amount {
                    currency
                    value
                }
            }
        }
    `
};

export default TaxSummary;
