import React from 'react';
import { Form } from 'informed';
import { array, bool, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './paymentsForm.module.css';
import PaymentsFormItems from './paymentsFormItems';
import { usePaymentsForm } from '@magento/peregrine/lib/talons/Checkout/usePaymentsForm';

/**
 * A wrapper around the payment form. This component's purpose is to maintain
 * the submission state as well as prepare/set initial values.
 */
const PaymentsForm = props => {
    const {
        handleSubmit,
        initialValues,
        isSubmitting,
        setIsSubmitting
    } = usePaymentsForm({
        initialValues: props.initialValues || {}
    });

    const classes = useStyle(defaultClasses, props.classes);
    const formChildrenProps = {
        ...props,
        classes,
        isSubmitting,
        setIsSubmitting
    };

    return (
        <Form
            className={classes.root}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            <PaymentsFormItems {...formChildrenProps} />
        </Form>
    );
};

PaymentsForm.propTypes = {
    classes: shape({
        root: string
    }),
    initialValues: shape({
        firstname: string,
        lastname: string,
        telephone: string,
        city: string,
        postcode: string,
        region_code: string,
        sameAsShippingAddress: bool,
        street0: array
    })
};

PaymentsForm.defaultProps = {
    initialValues: {}
};

export default PaymentsForm;
