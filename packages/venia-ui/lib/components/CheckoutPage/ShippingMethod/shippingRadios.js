import React from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';

import { mergeClasses } from '../../../classify';
import LoadingIndicator from '../../LoadingIndicator';
import RadioGroup from '../../RadioGroup';
import ShippingRadio from '../../CartPage/PriceAdjustments/ShippingMethods/shippingRadio';
import defaultClasses from './shippingRadios.css';

const ShippingRadios = props => {
    const { isLoading, shippingMethods } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (isLoading || !shippingMethods.length) {
        return (
            <LoadingIndicator>
                {'Loading shipping methods...'}
            </LoadingIndicator>
        );
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
            field="shipping_method"
            items={shippingRadios}
        />
    );
};

export default ShippingRadios;

ShippingRadios.propTypes = {
    classes: shape({
        loadingRoot: string,
        radioMessage: string,
        radioLabel: string,
        radioRoot: string
    }),
    isLoading: bool,
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
