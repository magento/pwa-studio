import React, { Component, Fragment, createElement } from 'react';
import { array, bool, func, object, shape, string } from 'prop-types';

import classify from 'src/classify';
import Section from './section';
import SubmitButton from './submitButton';
import defaultClasses from './form.css';
import Selector from 'src/components/Selector';
import Subtotal from 'src/components/Subtotal';

import AddressForm from './address';

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
            root: string
        }),
        editing: string,
        editOrder: func.isRequired,
        enterSubflow: func.isRequired,
        getShippingMethods: func.isRequired,
        isShippingInformationReady: bool,
        paymentMethod: string,
        shippingMethod: string,
        submitInput: func.isRequired,
        submitMockShippingAddress: func.isRequired,
        submitOrder: func.isRequired,
        submitting: bool.isRequired,
        valid: bool.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            updatePayment: false,
            updateShipping: false
        };
    }

    /*
     *  Class Properties.
     */
    get addressSnippet() {
        const { cart, valid } = this.props;
        const address = cart.details.billing_address;

        if (!valid) {
            return <span>Click to edit</span>;
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

    get cartOptions() {
        const { classes } = this.props;
        const {
            paymentMethod,
            shippingMethod,
            availableShippingMethods,
            isShippingInformationReady,
            cart
        } = this.props;

        const shipToText = this.isShippingInformationReady
            ? 'Complete'
            : 'Add Shipping Information';
        const paymentMethodText = paymentMethod
            ? paymentMethod
            : 'No payment methods available';
        let shippingMethodtext = !!availableShippingMethods
            ? 'Click to fill out'
            : 'Add Shipping Method';
        shippingMethodtext =
            isShippingInformationReady && !availableShippingMethods
                ? 'Loading...'
                : shippingMethodtext;
        shippingMethodtext =
            !!shippingMethod && !!shippingMethodtext
                ? shippingMethod
                : shippingMethodtext;

        return !this.state.updatePayment && !this.state.updateShipping ? (
            <div className={classes.body}>
                <Section
                    label="Ship To"
                    onClick={this.showShippingAddressSelector}
                >
                    <span>{shipToText}</span>
                </Section>
                <Section
                    label="Pay With"
                    onClick={this.showPaymentMethodSelector}
                >
                    <span>{paymentMethodText}</span>
                </Section>
                <Section
                    disabled={!availableShippingMethods}
                    label="Shipping Method"
                    onClick={this.showShippingMethodSelector}
                >
                    <span>{shippingMethodtext}</span>
                </Section>
                <div className={classes.footer}>
                    <Subtotal
                        items_qty={cart.details.items_qty}
                        currencyCode={cart.totals.base_currency_code}
                        subtotal={cart.totals.subtotal}
                    />
                </div>
            </div>
        ) : null;
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
            default: {
                return null;
            }
        }
    }

    get paymentMethodSelector() {
        const { paymentMethod, availablePaymentMethods } = this.props;

        return !!this.state.updatePayment ? (
            <Selector
                options={availablePaymentMethods}
                selectedOption={paymentMethod}
                handleSelection={code => this.modifyPaymentMethod(code)}
            />
        ) : null;
    }

    get shippingMethodSelector() {
        const { shippingMethod, availableShippingMethods } = this.props;

        return !!this.state.updateShipping ? (
            <Selector
                options={availableShippingMethods}
                selectedOption={shippingMethod}
                handleSelection={code => this.modifyShippingMethod(code)}
            />
        ) : null;
    }

    /*
     *  Component Lifecycle Methods.
     */
    componentDidMount() {
        // Set default payment method.
        this.setDefaultOrderMethod(
            this.props.availablePaymentMethods,
            this.modifyPaymentMethod
        );
    }
    
    // render() {
    //     const { classes, editing } = this.props;
    //     const children = editing ? this.editableForm : this.overview;

    //     return <div className={classes.root}>{children}</div>;
    // }

    render() {
        const { classes, submitOrder, submitting, valid } = this.props;

        const {
            shippingMethodSelector,
            paymentMethodSelector,
            cartOptions
        } = this;

        return (
            <div className={classes.root}>
                {shippingMethodSelector}
                {paymentMethodSelector}
                {cartOptions}
                <div className={classes.footer}>
                    <SubmitButton
                        submitOrder={submitOrder}
                        submitting={submitting}
                        valid={valid}
                    />
                </div>
            </div>
        );
    }

    /*
     *  Event Handlers.
     */
    editAddress = () => {
        this.props.editOrder('address');
    };

    modifyPaymentMethod = paymentMethod => {
        this.props.enterSubflow('SUBMIT_PAYMENT_INFORMATION', paymentMethod);
        this.setState({
            updatePayment: false
        });
    };

    modifyShippingMethod = shippingMethod => {
        this.props.enterSubflow('SUBMIT_SHIPPING_METHOD', shippingMethod);
        this.setState({
            updateShipping: false
        });
    };

    stopEditing = () => {
        this.props.editOrder(null);
    }

    submitAddress = formValues => {
        this.props.submitInput({
            type: 'address',
            formValues
        });
    };

    /*
     *  Helper Functions.
     */
    setDefaultOrderMethod = (orderMethodsAvailable, callback) => {
        // Just default it to the first available option.
        if (!!orderMethodsAvailable && !!orderMethodsAvailable[0]) {
            callback(orderMethodsAvailable[0]);
        }
    };

    showPaymentMethodSelector = () => {
        this.setState({
            updatePayment: true
        });
    };

    showShippingAddressSelector = () => {
        this.props.submitMockShippingAddress()
            .then(() => {
                this.props.getShippingMethods()
                    .then(() => {
                        // Default the shipping method to the first available one.
                        this.setDefaultOrderMethod(
                            this.props.availableShippingMethods,
                            this.modifyShippingMethod
                        );
                    });
            });
    };

    showShippingMethodSelector = () => {
        this.setState({
            updateShipping: true
        });
    };
}

export default classify(defaultClasses)(Form);
