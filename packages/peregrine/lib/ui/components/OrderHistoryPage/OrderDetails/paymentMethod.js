import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './paymentMethod.module.css';

const PaymentMethod = props => {
    const { data, classes: propsClasses } = props;
    const classes = useStyle(defaultClasses, propsClasses);
    /**
     * There can be multiple payment methods for an order but
     * since Venia does not support multiple payment methods yet
     * we are picking the first method in the array.
     */
    const [{ name }] = data;

    return (
        <div className={classes.root} data-cy="OrderDetails-PaymentMethod-root">
            <div className={classes.heading}>
                <FormattedMessage
                    id="orderDetails.paymentMethodLabel"
                    defaultMessage="Payment Method"
                />
            </div>
            <div className={classes.payment_type}>{name}</div>
        </div>
    );
};

export default PaymentMethod;

PaymentMethod.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        payment_type: string
    }),
    data: arrayOf(
        shape({
            name: string
        })
    )
};
