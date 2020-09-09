import React from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './paymentMethod.css';

const PaymentMethod = props => {
    const { data, classes: propsClasses } = props;
    const classes = mergeClasses(defaultClasses, propsClasses);

    const paymentMethods = data.map(paymentMethod => {
        const { type, additional_data } = paymentMethod;
        const { card_type, last_four } = additional_data;

        return (
            <div className={classes.payment_container}>
                <div className={classes.payment_type}>
                    {`${type} - ${card_type}`}
                </div>
                <div className={classes.payment_last_four_digits}>
                    {last_four}
                </div>
            </div>
        );
    });

    return (
        <div className={classes.root}>
            <div className={classes.heading}>{'Payment Method'}</div>
            <div className={classes.methods}>{paymentMethods}</div>
        </div>
    );
};

export default PaymentMethod;
