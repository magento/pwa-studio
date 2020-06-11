import React from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';

import { mergeClasses } from '../../../classify';
import RadioGroup from '../../RadioGroup';
import ShippingRadio from '../../CartPage/PriceAdjustments/ShippingMethods/shippingRadio';
import defaultClasses from './shippingRadios.css';

const ERROR_MESSAGE =
    'Error loading shipping methods. Please ensure a shipping address is set and try again.';

const ShippingRadios = props => {
    const { disabled, shippingMethods } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (!shippingMethods.length) {
        return <span className={classes.error}>{ERROR_MESSAGE}</span>;
    }

    const radioGroupClasses = {
        message: classes.radioMessage,
        radioLabel: classes.radioLabel,
        root: classes.radioRoot
    };

    const shippingRadios = shippingMethods.map(method => {
        const label = (
            <ShippingRadio
                currency={method.amount.currency}
                name={method.method_title}
                price={method.amount.value}
            />
        );
        const value = method.serializedValue;

        return { label, value };
    });

    return (
        <RadioGroup
            classes={radioGroupClasses}
            disabled={disabled}
            field="shipping_method"
            items={shippingRadios}
        />
    );
};

export default ShippingRadios;

ShippingRadios.propTypes = {
    classes: shape({
        error: string,
        radioMessage: string,
        radioLabel: string,
        radioRoot: string
    }),
    disabled: bool,
    shippingMethods: arrayOf(
        shape({
            amount: shape({
                currency: string,
                value: number
            }),
            available: bool,
            carrier_code: string,
            carrier_title: string,
            method_code: string,
            method_title: string,
            serializedValue: string.isRequired
        })
    ).isRequired
};
