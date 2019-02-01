import React, { Component, Fragment } from 'react';
import { Form, Text } from 'informed';
import { array, bool, func, shape, string } from 'prop-types';

import BraintreeDropin from './braintreeDropin';
import Label from './label';
import Button from 'src/components/Button';
import Checkbox from 'src/components/Checkbox';

import classify from 'src/classify';
import defaultClasses from './paymentsForm.css';

import isObjectEmpty from 'src/util/isObjectEmpty';
import { hasLengthAtLeast, isNotEmpty } from 'src/util/formValidators.js';

const DEFAULT_FORM_VALUES = {
    addresses_same: true
};

class PaymentsForm extends Component {
    static propTypes = {
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

    static defaultProps = {
        initialValues: {}
    };

    state = {
        isRequestingPaymentNonce: false
    };

    render() {
        const { classes, initialValues } = this.props;
        const { formChildren } = this;

        let initialFormValues;
        if (isObjectEmpty(initialValues)) {
            initialFormValues = DEFAULT_FORM_VALUES;
        }
        // We have some initial values, use them.
        else {
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

        return (
            <Form
                className={classes.root}
                getApi={this.setFormApi}
                initialValues={initialFormValues}
                onSubmit={this.submit}
            >
                {formChildren}
            </Form>
        );
    }

    /*
     *  Class Properties.
     */
    billingAddressFields = formState => {
        const { classes } = this.props;

        const getError = fieldName => {
            if (formState.errors[fieldName]) {
                return formState.errors[fieldName];
            }
        };

        return (
            <Fragment>
                <div className={classes.street0}>
                    <Label htmlFor={classes.street0}>Street</Label>
                    <Text
                        className={classes.textInput}
                        field="street[0]"
                        id={classes.street0}
                        validate={this.validateStreet}
                    />
                    <span className={classes.validation}>
                        {getError('street')}
                    </span>
                </div>
                <div className={classes.city}>
                    <Label htmlFor={classes.city}>City</Label>
                    <Text
                        className={classes.textInput}
                        field="city"
                        id={classes.city}
                        validate={this.validateCity}
                    />
                    <span className={classes.validation}>
                        {getError('city')}
                    </span>
                </div>
                <div className={classes.region_code}>
                    <Label htmlFor={classes.region_code}>State</Label>
                    <Text
                        className={classes.textInput}
                        field="region_code"
                        id={classes.region_code}
                        validate={this.validateState}
                        validateOnBlur
                    />
                    <span className={classes.validation}>
                        {getError('region_code')}
                    </span>
                </div>
                <div className={classes.postcode}>
                    <Label htmlFor={classes.postcode}>ZIP</Label>
                    <Text
                        className={classes.textInput}
                        field="postcode"
                        id={classes.postcode}
                        validate={this.validatePostcode}
                    />
                    <span className={classes.validation}>
                        {getError('postcode')}
                    </span>
                </div>
            </Fragment>
        );
    };

    /*
     *  Class Functions.
     */
    formChildren = ({ formState }) => {
        const { classes, submitting } = this.props;

        return (
            <Fragment>
                <div className={classes.body}>
                    <h2 className={classes.heading}>Billing Information</h2>
                    <div className={classes.braintree}>
                        <BraintreeDropin
                            isRequestingPaymentNonce={
                                this.state.isRequestingPaymentNonce
                            }
                            onError={this.cancelPaymentNonceRequest}
                            onSuccess={this.setPaymentNonce}
                        />
                    </div>
                    <div className={classes.address_check}>
                        <Checkbox
                            field="addresses_same"
                            label="Billing address same as shipping address"
                        />
                    </div>
                    {!formState.values.addresses_same &&
                        this.billingAddressFields(formState)}
                </div>
                <div className={classes.footer}>
                    <Button className={classes.button} onClick={this.cancel}>
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

    setFormApi = formApi => {
        this.formApi = formApi;
    };

    /*
     *  Event Handlers.
     */
    cancel = () => {
        this.props.cancel();
    };

    submit = () => {
        this.setState({ isRequestingPaymentNonce: true });
    };

    setPaymentNonce = value => {
        this.setState({
            isRequestingPaymentNonce: false
        });

        // Build up the billing address payload.
        const formValue = this.formApi.getValue;
        let billingAddress = {
            sameAsShippingAddress: formValue('addresses_same') || false
        };

        if (!billingAddress.sameAsShippingAddress) {
            billingAddress = {
                city: formValue('city'),
                postcode: formValue('postcode'),
                region_code: formValue('region_code'),
                street: formValue('street')
            };
        }

        // Submit the payment method and billing address payload.
        this.props.submit({
            billingAddress,
            paymentMethod: {
                code: 'braintree',
                data: value
            }
        });
    };

    cancelPaymentNonceRequest = () => {
        this.setState({ isRequestingPaymentNonce: false });
    };

    validateCity = value => isNotEmpty(value);

    validatePostcode = value => isNotEmpty(value);

    validateState = value => hasLengthAtLeast(value, 2);

    validateStreet = value => isNotEmpty(value);
}

export default classify(defaultClasses)(PaymentsForm);
