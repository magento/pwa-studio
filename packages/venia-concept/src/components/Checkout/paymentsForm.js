import React, { useCallback, useState } from 'react';
import { Form } from 'informed';
import { array, bool, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './paymentsForm.css';
import isObjectEmpty from '../../util/isObjectEmpty';
import PaymentsFormItems from './paymentsFormItems';

const DEFAULT_FORM_VALUES = {
    addresses_same: true
};

/**
 * A wrapper around the payment form. This component's purpose is to maintain
 * the submission state as well as prepare/set initial values.
 */
const PaymentsForm = props => {
    const { initialValues } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(() => {
        setIsSubmitting(true);
    }, [setIsSubmitting]);

    let initialFormValues;
    if (isObjectEmpty(initialValues)) {
        initialFormValues = DEFAULT_FORM_VALUES;
    } else {
        if (initialValues.sameAsShippingAddress) {
            // If the addresses are the same, don't populate any fields
            // other than the checkbox with an initial value.
            initialFormValues = {
                addresses_same: true
            };
        } else {
            // The addresses are not the same, populate the other fields.
            initialFormValues = {
                addresses_same: false,
                ...initialValues
            };
            delete initialFormValues.sameAsShippingAddress;
        }
    }

    const formChildrenProps = {
        ...props,
        classes,
        isSubmitting,
        setIsSubmitting
    };

    return (
        <Form
            className={classes.root}
            initialValues={initialFormValues}
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
