import React, { useCallback, useState } from 'react';
import { Form } from 'informed';
import { array, bool, func, shape, string } from 'prop-types';

import Button from '../Button';
import Label from './label';
import Select from '../Select';

import { mergeClasses } from '../../classify';
import defaultClasses from './shippingForm.css';

const ShippingForm = props => {
    const {
        availableShippingMethods,
        cancel,
        shippingMethod,
        submit: submitShippingMethod
    } = props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const classes = mergeClasses(defaultClasses, props.classes);

    let initialValue;
    let selectableShippingMethods;

    if (availableShippingMethods.length) {
        selectableShippingMethods = availableShippingMethods.map(
            ({ carrier_code, carrier_title }) => ({
                label: carrier_title,
                value: carrier_code
            })
        );
        initialValue =
            shippingMethod || availableShippingMethods[0].carrier_code;
    } else {
        selectableShippingMethods = [];
        initialValue = '';
    }

    const handleSubmit = useCallback(
        async ({ shippingMethod }) => {
            setIsSubmitting(true);
            const selectedShippingMethod = availableShippingMethods.find(
                ({ carrier_code }) => carrier_code === shippingMethod
            );

            if (!selectedShippingMethod) {
                console.warn(
                    `Could not find the selected shipping method ${selectedShippingMethod} in the list of available shipping methods.`
                );
                cancel();
            } else {
                await submitShippingMethod({
                    shippingMethod: selectedShippingMethod
                });
            }

            setIsSubmitting(false);
        },
        [
            availableShippingMethods,
            cancel,
            setIsSubmitting,
            submitShippingMethod
        ]
    );

    return (
        <Form className={classes.root} onSubmit={handleSubmit}>
            <div className={classes.body}>
                <h2 className={classes.heading}>Shipping Information</h2>
                <div
                    className={classes.shippingMethod}
                    id={classes.shippingMethod}
                >
                    <Label htmlFor={classes.shippingMethod}>
                        Shipping Method
                    </Label>
                    <Select
                        field="shippingMethod"
                        initialValue={initialValue}
                        items={selectableShippingMethods}
                    />
                </div>
            </div>
            <div className={classes.footer}>
                <Button className={classes.button} onClick={cancel}>
                    Cancel
                </Button>
                <Button
                    className={classes.button}
                    priority="high"
                    type="submit"
                    disabled={isSubmitting}
                >
                    Use Method
                </Button>
            </div>
        </Form>
    );
};

ShippingForm.propTypes = {
    availableShippingMethods: array.isRequired,
    cancel: func.isRequired,
    classes: shape({
        body: string,
        button: string,
        footer: string,
        heading: string,
        shippingMethod: string
    }),
    shippingMethod: string,
    submit: func.isRequired,
    submitting: bool
};

ShippingForm.defaultProps = {
    availableShippingMethods: [{}]
};

export default ShippingForm;
