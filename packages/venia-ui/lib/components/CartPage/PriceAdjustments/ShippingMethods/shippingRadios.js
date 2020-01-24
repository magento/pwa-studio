import React, { Fragment } from 'react';

import RadioGroup from '../../../RadioGroup';

import { mergeClasses } from '../../../../classify';
import defaultClasses from './shippingRadios.css';

const TestComponent = () => (
    <Fragment>
        <h3>Standard Shipping</h3>
        <p>(4-8 business days via USPS)</p>
        <p>
            <b>FREE</b>
        </p>
    </Fragment>
);

const TestExpressComponent = () => (
    <Fragment>
        <h3>Express Delivery</h3>
        <p>(2-5 business days via USPS)</p>
        <p>
            <b>$17.95</b>
        </p>
    </Fragment>
);

const DUMMY_RADIO_ITEMS = [
    { label: <TestComponent />, value: 'Standard' },
    { label: <TestExpressComponent />, value: 'Express' },
    { label: 'Next Day', value: 'Next Day' }
];

const ShippingRadios = props => {
    const { shippingMethods } = props;
    const test = shippingMethods.map(shippingMethod => ({
        label: shippingMethod.carrier_title,
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
            items={test}
        />
    );
};

export default ShippingRadios;
