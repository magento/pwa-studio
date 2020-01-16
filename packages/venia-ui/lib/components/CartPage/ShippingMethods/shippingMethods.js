import React from 'react';
import { Form } from 'informed';

import { shippingMethodSteps, useShippingMethods } from '@magento/peregrine/lib/talons/CartPage/useShippingMethods';

import Select from '../../Select';
import TextInput from '../../TextInput';
import ShippingRadios from './shippingRadios';

import { mergeClasses } from '../../../classify';
import defaultClasses from './shippingMethods.css';

const DUMMY_COUNTRIES = [
    { label: 'United States', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' }
];
const DUMMY_STATES = [
    { label: 'California', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' }
];

const ShippingMethods = props => {
    const { handleSubmit, setStep, step } = useShippingMethods();

    const classes = mergeClasses(defaultClasses, props.classes);
    const shippingMethodsClassName = step === shippingMethodSteps.COLLECTING_METHODS ? classes.shipping_methods : classes.shipping_methods_hidden;

    return (
        <Form className={classes.root} onSubmit={handleSubmit}>
            <div className={classes.country}>
                <h3 className={classes.prompt}>Country</h3>
                <Select
                    field="country"
                    items={DUMMY_COUNTRIES}
                />
            </div>
            <div className={classes.state}>
                <h3 className={classes.prompt}>State</h3>
                <Select
                    field="states"
                    items={DUMMY_STATES}
                />
            </div>
            <div className={classes.zip}>
                <h3 className={classes.prompt}>ZIP</h3>
                <TextInput field="zip" />
            </div>
            <div className={classes.shipping_methods}>
                <h3 className={classes.prompt}>Shipping Methods</h3>
                <ShippingRadios />
            </div>
        </Form>
    );
};

export default ShippingMethods;
