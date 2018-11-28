import React, { Component, Fragment, createElement } from 'react';
import { array, bool, func, object, shape, string } from 'prop-types';

import { Price } from '@magento/peregrine';
import AddressForm from './addressForm';
import PaymentsForm from './paymentsForm';
import Section from './section';
import ShippingForm from './shippingForm';
import SubmitButton from './submitButton';

import classify from 'src/classify';
import defaultClasses from './form.css';

class Form extends Component {
    static propTypes = {
        availablePaymentMethods: array,
        availableShippingMethods: array,
        cart: shape({
            details: object,
            guestCartId: string,
            totals: object
        }).isRequired,
        classes: shape({
            body: string,
            footer: string,
            informationPrompt: string,
            root: string
        }),
        editing: string,
        editOrder: func.isRequired,
        enterSubflow: func.isRequired,
        getShippingMethods: func.isRequired,
        isShippingInformationReady: bool,
        paymentMethod: string,
        shippingMethod: string,
        submitAddress: func.isRequired,
        submitOrder: func.isRequired,
        submitPaymentMethod: func.isRequired,
        submitShippingMethod: func.isRequired,
        submitting: bool.isRequired,
        valid: bool.isRequired
    };

    constructor(...args) {
        super(...args);
        this.state = {
            updatePayment: false,
            updateShipping: false
        };
    }

    /*
     *  Class Properties.
     */
    get addressSummary() {
        const { cart, valid } = this.props;
        const address = cart.details.billing_address;

        if (!valid) {
            return <span className={classes.informationPrompt}>Add Shipping Information</span>;
        }

        const name = `${address.firstname} ${address.lastname}`;
        const street = `${address.street.join(' ')}`;

        return (
            <Fragment>
                <strong>{name}</strong>
                <br />
                <span>{street}</span>
            </Fragment>
        );
    }

    get editableForm() {
        const { cart, editing, submitting } = this.props;

        switch (editing) {
            case 'address': {
                const { details } = cart;

                return (
                    <AddressForm
                        initialValues={details.billing_address}
                        submitting={submitting}
                        cancel={this.stopEditing}
                        submit={this.submitAddress}
                    />
                );
            }
            case 'paymentMethod': {
                const { availablePaymentMethods, paymentMethod } = this.props;

                return (
                    <PaymentsForm
                        availablePaymentMethods={availablePaymentMethods}
                        cancel={this.stopEditing}
                        paymentMethod={paymentMethod}
                        submit={this.submitPaymentMethod}
                        submitting={submitting}
                    />
                )
            }
            case 'shippingMethod': {
                const { availableShippingMethods, shippingMethod } = this.props;

                return (
                    <ShippingForm
                        availableShippingMethods={availableShippingMethods}
                        cancel={this.stopEditing}
                        shippingMethod={shippingMethod}
                        submit={this.submitShippingMethod}
                        submitting={submitting}
                    />
                );
            }
            default: {
                return null;
            }
        }
    }
    
    get overview() {
        const { cart, classes, submitOrder, submitting, valid } = this.props;

        return (
            <Fragment>
                <div className={classes.body}>
                    <Section label="Ship To" onClick={this.editAddress}>
                        {this.addressSummary}
                    </Section>
                    <Section label="Pay With" onClick={this.editPaymentMethod}>
                        {this.paymentMethodSummary}
                    </Section>
                    <Section label="Get It By" onClick={this.editShippingMethod}>
                        {this.shippingMethodSummary}
                    </Section>
                    <Section label="TOTAL">
                        <Price
                            currencyCode={cart.totals.quote_currency_code}
                            value={cart.totals.subtotal}
                        ></Price>
                        <br />
                        <span>{cart.details.items_qty} Items</span>
                    </Section>
                </div>
                <div className={classes.footer}>
                    <SubmitButton
                        submitting={submitting}
                        valid={valid}
                        submitOrder={submitOrder}
                    />
                </div>
            </Fragment>
        );
    }

    get paymentMethodSummary() {
        const { classes, paymentMethod } = this.props;

        if (!paymentMethod) {
            return <span className={classes.informationPrompt}>Add Billing Information</span>;
        }

        return (
            <Fragment>
                <strong>{paymentMethod}</strong>
            </Fragment>
        );
    }

    get shippingMethodSummary() {
        const { classes, shippingMethod } = this.props;

        if (!shippingMethod) {
            return <span className={classes.informationPrompt}>Add Shipping Information</span>
        }

        return (
            <Fragment>
                <strong>{shippingMethod}</strong>
            </Fragment>
        );
    }

    /*
     *  Component Lifecycle Methods.
     */    
    render() {
        const { classes, editing } = this.props;
        const children = editing ? this.editableForm : this.overview;

        return <div className={classes.root}>{children}</div>;
    }

    /*
     *  Event Handlers.
     */
    editAddress = () => {
        this.props.editOrder('address');
    };

    editPaymentMethod = () => {
        this.props.editOrder('paymentMethod');
    }

    editShippingMethod = () => {
        this.props.editOrder('shippingMethod');
    }

    stopEditing = () => {
        this.props.editOrder(null);
    }

    submitAddress = formValues => {
        this.props.submitAddress({
            type: 'address',
            formValues
        });
    };

    submitPaymentMethod = formValues => {
        //console.log('submitting payment method. form values', formValues);
        this.props.submitPaymentMethod({
            type: 'paymentMethod',
            formValues,
        });
    }

    submitShippingMethod = formValues => {
        //console.log('submitting shipping method. form values', formValues);
        this.props.submitShippingMethod({
            type: 'shippingMethod',
            formValues,
        });   
    }
}

export default classify(defaultClasses)(Form);
