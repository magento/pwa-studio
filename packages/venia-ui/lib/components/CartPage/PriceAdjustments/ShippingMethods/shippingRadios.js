import React from 'react';

import RadioGroup from '../../../RadioGroup';

import { mergeClasses } from '../../../../classify';
import defaultClasses from './shippingRadios.css';
import ShippingRadio from './shippingRadio';

const ShippingRadios = props => {
    const { shippingMethods } = props;
    const radioComponents = shippingMethods.map(shippingMethod => ({
        key: shippingMethod.method_code,
        label: (
            <ShippingRadio
                currency={shippingMethod.amount.currency}
                name={shippingMethod.method_title}
                price={shippingMethod.amount.value}
            />
        ),
        value: {
            carrier_code: shippingMethod.carrier_code,
            method_code: shippingMethod.method_code
        }
    }));
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <RadioGroup
            classes={{
                radio: classes.radio,
                radioLabel: classes.radio_contents,
                root: classes.root
            }}
            field="method"
            items={radioComponents}
        />
    );
};

export default ShippingRadios;
