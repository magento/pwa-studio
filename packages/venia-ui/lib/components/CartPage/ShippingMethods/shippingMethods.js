import React from 'react';
import { Form } from 'informed';

import { useShippingMethods } from '@magento/peregrine/lib/talons/CartPage/useShippingMethods';

import RadioGroup from '../../RadioGroup';
import Select from '../../Select';
import TextInput from '../../TextInput';

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
const DUMMY_RADIO_ITEMS = [
    { label: 'Standard', value: 'Standard' },
    { label: 'Express', value: 'Express' },
    { label: 'Next Day', value: 'Next Day' }
]

const ShippingMethods = props => {
    const { handleSubmit } = useShippingMethods();

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Form className={classes.root} onSubmit={handleSubmit}>
            <h3 className={classes.prompt}>Country</h3>
            <Select
                field="country"
                initialValue={{}}
                items={DUMMY_COUNTRIES}
            />
            <h3 className={classes.prompt}>State</h3>
            <Select
                field="states"
                initialValue={{}}
                items={DUMMY_STATES}
            />
            <h3 className={classes.prompt}>ZIP</h3>
            <TextInput field="zip" />
            <h3 className={classes.prompt}>Shipping Methods</h3>
            <RadioGroup items={DUMMY_RADIO_ITEMS}></RadioGroup>
        </Form>
    );
};

export default ShippingMethods;
