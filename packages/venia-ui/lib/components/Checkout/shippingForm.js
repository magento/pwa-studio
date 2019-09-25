import React from 'react';
import { Form } from 'informed';
import { array, bool, func, shape, string } from 'prop-types';

import Button from '../Button';
import Label from './label';
import Select from '../Select';

import { mergeClasses } from '../../classify';
import defaultClasses from './shippingForm.css';
import { useShippingForm } from '@magento/peregrine/lib/talons/Checkout/useShippingForm';

const ShippingForm = props => {
    const {
        availableShippingMethods,
        isSubmitting,
        onCancel,
        onSubmit,
        shippingMethod
    } = props;

    const talonProps = useShippingForm({
        availableShippingMethods,
        onCancel,
        onSubmit,
        initialValue: shippingMethod
    });

    const {
        handleCancel,
        handleSubmit,
        initialValue,
        selectableShippingMethods
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

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
                <Button onClick={handleCancel}>Cancel</Button>
                <Button priority="high" type="submit" disabled={isSubmitting}>
                    Use Method
                </Button>
            </div>
        </Form>
    );
};

ShippingForm.propTypes = {
    availableShippingMethods: array.isRequired,
    onCancel: func.isRequired,
    classes: shape({
        body: string,
        button: string,
        footer: string,
        heading: string,
        shippingMethod: string
    }),
    isSubmitting: bool,
    shippingMethod: string,
    onSubmit: func.isRequired,
    submitting: bool
};

ShippingForm.defaultProps = {
    availableShippingMethods: [{}]
};

export default ShippingForm;
