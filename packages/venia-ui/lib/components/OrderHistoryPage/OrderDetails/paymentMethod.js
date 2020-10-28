import React, { useMemo } from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

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
    const { card_type, last_four } = useMemo(() => {
        const mappedAdditionalData = {};

        additional_data.forEach(additionalData => {
            mappedAdditionalData[additionalData.name] = additionalData.value;
        });

        return mappedAdditionalData;
    }, [additional_data]);

    const typeString = `${type} - ${card_type}`;

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <FormattedMessage
                    id="orderDetails.paymentMethodLabel"
                    defaultMessage="Payment Method"
                />
            </div>
            <div className={classes.payment_type}>{typeString}</div>
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
            additional_data: arrayOf(
                shape({
                    name: string,
                    value: string
                })
            )
        })
    )
};
