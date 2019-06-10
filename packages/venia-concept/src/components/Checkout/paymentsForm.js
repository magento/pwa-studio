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
        isSubmitting,
        setIsSubmitting,
        submit,
        submitting
    } = props;

    // Currently form state toggles dirty from false to true because of how
    // informed is implemented. This effectively causes this child components
    // to re-render multiple times. Keep tabs on the following issue:
    //   https://github.com/joepuzzo/informed/issues/138
    // If they resolve it or we move away from informed we can probably get some
    // extra performance.
    const formState = useFormState();

    const billingAddressFields = !formState.values.addresses_same ? (
        <BillingAddressFields classes={classes} countries={countries} />
    ) : null;

    const handleCancel = useCallback(() => {
        cancel();
    }, [cancel]);

    const handleError = useCallback(() => {
        setIsSubmitting(false);
    });

    // The success callback. Unfortunately since form state is created first and
    // then modified when using initialValues any component who uses this
    // callback will be rendered multiple times on first render. See above
    // comments for more info.
    const handleSuccess = useCallback(
        value => {
            setIsSubmitting(false);
            const sameAsShippingAddress = formState.values['addresses_same'];
            let billingAddress;
            if (!sameAsShippingAddress) {
                billingAddress = {
                    city: formState.values['city'],
                    postcode: formState.values['postcode'],
                    region_code: formState.values['region_code'],
                    street: formState.values['street']
                };
            } else {
                billingAddress = {
                    sameAsShippingAddress
                };
            }
            submit({
                billingAddress,
                paymentMethod: {
                    code: 'braintree',
                    data: value
                }
            });
        },
        [formState.values]
    );

    return (
        <Fragment>
            <div className={classes.body}>
                <h2 className={classes.heading}>Billing Information</h2>
                <div className={classes.braintree}>
                    <BraintreeDropin
                        shouldRequestPaymentNonce={isSubmitting}
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

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(() => {
        setIsSubmitting(true);
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
        isSubmitting,
        setIsSubmitting
    };

    return (
        <Form
            className={classes.root}
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
