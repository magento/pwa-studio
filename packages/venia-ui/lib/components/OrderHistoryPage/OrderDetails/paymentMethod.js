import React from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './paymentMethod.css';

const PaymentMethod = props => {
    const { data, classes: propsClasses } = props;
    const classes = mergeClasses(defaultClasses, propsClasses);
    /**
     * There can be multiple payment methods for an order but
     * since Venia does not support multiple payment methods yet
     * we are picking the first method in the array.
     */
    const [{ type, additional_data }] = data;
    const { card_type, last_four } = additional_data;

    return (
        <div className={classes.root}>
            <div className={classes.heading}>{'Payment Method'}</div>
            <div className={classes.payment_type}>
                {`${type} - ${card_type}`}
            </div>
            <div className={classes.payment_last_four_digits}>{last_four}</div>
        </div>
    );
};

export default PaymentMethod;

PaymentMethod.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        payment_type: string,
        payment_last_four_digits: string
    }),
    data: arrayOf(
        shape({
            type: string,
            additional_data: shape({
                card_type: string,
                last_four: string
            })
        })
    )
};
