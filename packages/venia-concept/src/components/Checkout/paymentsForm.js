import React, { Component, Fragment } from 'react';
import { Form, Text } from 'informed';
import { bool, func, shape, string } from 'prop-types';

import BraintreeDropin from './braintreeDropin';
import Label from './label';
import Button from 'src/components/Button';
import Checkbox from 'src/components/Checkbox';

import classify from 'src/classify';
import defaultClasses from './paymentsForm.css';

const INITIAL_FORM_VALUES = {
    'addresses_same': true
};

class PaymentsForm extends Component {
    static propTypes = {
        cancel: func.isRequired,
        classes: shape({
            body: string,
            footer: string,
            heading: string,
        }),
        submit: func.isRequired,
        submitting: bool
    };

    state = {
        isRequestingPaymentNonce: false,
    };

    render() {
        const { classes } = this.props;
        const { formChildren } = this;

        return (
            <Form
                className={classes.root}
                getApi={this.setFormApi}
                initialValues={INITIAL_FORM_VALUES}
                onSubmit={this.submit}
            >
                { formChildren }
            </Form>
        );
    }

    /*
     *  Class Properties.
     */
    get billingAddressFields () {
        const { classes } = this.props;

        return (
            <Fragment>
                <div className={classes.street}>
                    <Label htmlFor={classes.street}>Street</Label>
                    <Text
                        id={classes.street}
                        field="street"
                        className={classes.textInput}
                    />
                </div>
                <div className={classes.city}>
                    <Label htmlFor={classes.city}>City</Label>
                    <Text
                        id={classes.city}
                        field="city"
                        className={classes.textInput}
                    />
                </div>
                <div className={classes.region_code}>
                    <Label htmlFor={classes.region_code}>State</Label>
                    <Text
                        id={classes.region_code}
                        field="region_code"
                        className={classes.textInput}
                        validate={this.validateState}
                    />
                </div>
                <div className={classes.postcode}>
                    <Label htmlFor={classes.postcode}>ZIP</Label>
                    <Text
                        id={classes.postcode}
                        field="postcode"
                        className={classes.textInput}
                    />
                </div>
            </Fragment>
        );
    }

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
                    { !formState.values.addresses_same && (
                        this.billingAddressFields
                    )}
                </div>
                <div className={classes.footer}>
                    <Button priority="high" type="submit" disabled={submitting}>
                        Save
                    </Button>
                    <Button onClick={this.cancel}>Cancel</Button>
                </div>
            </Fragment>
        );
    }

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
            sameAsShippingAddress: formValue('addresses_same')
        };
        
        if (!billingAddress.sameAsShippingAddress) {
            billingAddress = {
                ...billingAddress,
                city: formValue('city'),
                postcode: formValue('postcode'),
                region_code: formValue('region_code'),
                street: [formValue('street')]
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
