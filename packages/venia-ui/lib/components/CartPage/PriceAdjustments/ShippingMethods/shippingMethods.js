import React from 'react';
import { Form } from 'informed';

import { useShippingMethods } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/useShippingMethods';

import { mergeClasses } from '../../../../classify';
import Field from '../../../Field';
import Select from '../../../Select';
import TextInput from '../../../TextInput';
import defaultClasses from './shippingMethods.css';
import ShippingRadios from './shippingRadios';

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
    const { handleSubmit } = useShippingMethods();

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Form className={classes.root} onSubmit={handleSubmit}>
            <Field
                id="country"
                label="Country"
                classes={{ root: classes.country }}
            >
                <Select field="country" items={DUMMY_COUNTRIES} />
            </Field>
            <Field id="states" label="State" classes={{ root: classes.state }}>
                <Select field="states" items={DUMMY_STATES} />
            </Field>
            <Field id="zip" label="ZIP" classes={{ root: classes.zip }}>
                <TextInput field="zip" />
            </Field>
            <div className={classes.shipping_methods}>
                <h3 className={classes.prompt}>Shipping Methods</h3>
                <ShippingRadios />
            </div>
        </Form>
    );
};

export default ShippingMethods;
