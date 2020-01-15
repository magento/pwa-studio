import React, { Fragment } from 'react';

import RadioGroup from '../../RadioGroup';

import { mergeClasses } from '../../../classify';
import defaultClasses from './shippingRadios.css';

const TestComponent = () => (
    <Fragment>
        <h3>Standard Shipping</h3>
        <p>(4-8 business days via USPS)</p>
        <p><b>FREE</b></p>
    </Fragment>
);

const DUMMY_RADIO_ITEMS = [
    { label: <TestComponent />, value: 'Standard' },
    { label: 'Express', value: 'Express' },
    { label: 'Next Day', value: 'Next Day' }
]

const ShippingRadios = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <RadioGroup 
            classes={{
                radio: classes.radio,
                radioLabel: classes.radio_contents,
                root: classes.root
            }}
            items={DUMMY_RADIO_ITEMS}>
        </RadioGroup>
    )
};

export default ShippingRadios;
