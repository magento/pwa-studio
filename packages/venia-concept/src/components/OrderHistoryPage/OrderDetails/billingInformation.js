import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './billingInformation.module.css';

const BillingInformation = props => {
    const { data, total, classes: propsClasses } = props;
    const classes = useStyle(defaultClasses, propsClasses);

    return (
        <div
            className={classes.root}
            data-cy="OrderDetails-BillingInformation-root"
        >
            <div className={classes.heading}>
                <FormattedMessage
                    id="orderDetails.totalPrice"
                    defaultMessage="Total price"
                />
            </div>
            <div className={classes.billingData}>
                <span>
                    <Price
                        value={total?.grand_total.value}
                        currencyCode={total?.grand_total.currency}
                    />
                </span>
            </div>
        </div>
    );
};

export default BillingInformation;

BillingInformation.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        name: string,
        streetRow: string,
        additionalAddress: string
    })
};
