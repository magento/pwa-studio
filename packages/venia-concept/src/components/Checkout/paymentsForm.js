import React, { Component, Fragment } from 'react';
import { Form } from 'informed';
import { array, bool, func, shape, string } from 'prop-types';

import BraintreeDropin from './braintreeDropin';
import Button from 'src/components/Button';
import Checkbox from 'src/components/Checkbox';
import Field from 'src/components/Field';
import TextInput from 'src/components/TextInput';
import classify from 'src/classify';

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
        submitting: bool,
        countries: array
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
    billingAddressFields = () => {
        const { classes, countries } = this.props;

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
                        this.billingAddressFields()}
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
}

export default classify(defaultClasses)(PaymentsForm);
