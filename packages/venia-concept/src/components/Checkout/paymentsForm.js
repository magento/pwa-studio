import React, { useCallback, useState, Fragment } from 'react';
import { Form, useFormState } from 'informed';
import { array, bool, func, shape, string } from 'prop-types';

import BraintreeDropin from './braintreeDropin';
import Button from 'src/components/Button';
import Checkbox from 'src/components/Checkbox';
import Field from 'src/components/Field';
import TextInput from 'src/components/TextInput';
import { mergeClasses } from 'src/classify';
import defaultClasses from './paymentsForm.css';
import isObjectEmpty from 'src/util/isObjectEmpty';
import {
    isRequired,
    hasLengthExactly,
    validateRegionCode
} from 'src/util/formValidators';
import combine from 'src/util/combineValidators';

const DEFAULT_FORM_VALUES = {
    addresses_same: true
};

const BillingAddressFields = ({ classes, countries }) => {
    return (
        <Fragment>
            <div className={classes.street0}>
                <Field label="Street">
                    <TextInput
                        id={classes.street0}
                        field="street[0]"
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={classes.city}>
                <Field label="City">
                    <TextInput
                        id={classes.city}
                        field="city"
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={classes.region_code}>
                <Field label="State">
                    <TextInput
                        id={classes.region_code}
                        field="region_code"
                        validate={combine([
                            isRequired,
                            [hasLengthExactly, 2],
                            [validateRegionCode, countries]
                        ])}
                    />
                </Field>
            </div>
            <div className={classes.postcode}>
                <Field label="ZIP">
                    <TextInput
                        id={classes.postcode}
                        field="postcode"
                        validate={isRequired}
                    />
                </Field>
            </div>
        </Fragment>
    );
};

const FormChildren = props => {
    const {
        cancel,
        classes,
        countries,
        formApi,
        isRequestingPaymentNonce,
        setIsRequestingPaymentNonce,
        submit,
        submitting
    } = props;
    const formState = useFormState();

    const billingAddressFields = !formState.values.addresses_same ? (
        <BillingAddressFields classes={classes} countries={countries} />
    ) : null;

    const handleError = useCallback(() => {
        setIsRequestingPaymentNonce(false);
    });

    const handleCancel = useCallback(() => {
        cancel();
    }, [cancel]);

    const handleSuccess = useCallback(
        value => {
            setIsRequestingPaymentNonce(false);

            // Build up the billing address payload.
            const formValue = formApi.getValue;
            const sameAsShippingAddress = formValue('addresses_same') || false;

            let billingAddress;
            if (!sameAsShippingAddress) {
                billingAddress = {
                    city: formValue('city'),
                    postcode: formValue('postcode'),
                    region_code: formValue('region_code'),
                    street: formValue('street')
                };
            } else {
                billingAddress = {
                    sameAsShippingAddress
                };
            }

            // Submit the payment method and billing address payload.
            submit({
                billingAddress,
                paymentMethod: {
                    code: 'braintree',
                    data: value
                }
            });
        },
        [formApi]
    );

    return (
        <Fragment>
            <div className={classes.body}>
                <h2 className={classes.heading}>Billing Information</h2>
                <div className={classes.braintree}>
                    <BraintreeDropin
                        isRequestingPaymentNonce={isRequestingPaymentNonce}
                        onError={handleError}
                        onSuccess={handleSuccess}
                    />
                </div>
                <div className={classes.address_check}>
                    <Checkbox
                        field="addresses_same"
                        label="Billing address same as shipping address"
                    />
                </div>
                {billingAddressFields}
            </div>
            <div className={classes.footer}>
                <Button className={classes.button} onClick={handleCancel}>
                    Cancel
                </Button>
                <Button
                    className={classes.button}
                    priority="high"
                    type="submit"
                    disabled={submitting}
                >
                    Use Card
                </Button>
            </div>
        </Fragment>
    );
};

const PaymentsForm = props => {
    const { initialValues } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    // We request the payment nonce when the form submits. That action is
    // dispatched by this PaymentsForm component
    const [isRequestingPaymentNonce, setIsRequestingPaymentNonce] = useState(
        false
    );

    const [formApi, setFormApi] = useState(null);

    const handleSubmit = useCallback(() => {
        setIsRequestingPaymentNonce(true);
    });

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
        formApi,
        isRequestingPaymentNonce,
        setIsRequestingPaymentNonce
    };

    return (
        <Form
            className={classes.root}
            getApi={setFormApi}
            initialValues={initialFormValues}
            onSubmit={handleSubmit}
        >
            <FormChildren {...formChildrenProps} />
        </Form>
    );
};

PaymentsForm.propTypes = {
    cancel: func.isRequired,
    classes: shape({
        address_check: string,
        body: string,
        button: string,
        braintree: string,
        city: string,
        footer: string,
        heading: string,
        postcode: string,
        region_code: string,
        street0: string,
        textInput: string
    }),
    countries: array,
    initialValues: shape({
        city: string,
        postcode: string,
        region_code: string,
        sameAsShippingAddress: bool,
        street0: array
    }),
    submit: func.isRequired,
    submitting: bool
};

PaymentsForm.defaultProps = {
    initialValues: {}
};

export default PaymentsForm;
