import React, { Component } from 'react';
import { array, bool, func, object, shape, string } from 'prop-types';

import classify from 'src/classify';
import Cart from './cart';
import Form from './form';
import Receipt from './Receipt';
import defaultClasses from './flow.css';

const stepMap = {
    cart: 1,
    form: 2,
    receipt: 3
};

const isCartReady = items => items > 0;
const isAddressValid = address => !!(address && address.email);

class Flow extends Component {
    static propTypes = {
        actions: shape({
            beginCheckout: func.isRequired,
            editOrder: func.isRequired,
            enterSubflow: func.isRequired,
            getShippingMethods: func.isRequired,
            resetCheckout: func.isRequired,
            submitInput: func.isRequired,
            submitMockShippingAddress: func.isRequired,
            submitOrder: func.isRequired,
        }).isRequired,
        availablePaymentMethods: array,
        availableShippingMethods: array,
        cart: shape({
            details: object,
            guestCartId: string,
            totals: object
        }),
        checkout: shape({
            editing: string,
            step: string,
            submitting: bool
        }),
        classes: shape({
            root: string
        }),
        isShippingInformationReady: bool,
        paymentMethod: string,
        shippingMethod: string,
        status: string,
    };

    get child() {
        const {
            actions,
            availablePaymentMethods,
            availableShippingMethods,
            cart,
            checkout,
            isShippingInformationReady,
            paymentMethod,
            shippingMethod,
            status,
        } = this.props;

        const {
            beginCheckout,
            editOrder,
            enterSubflow,
            getShippingMethods,
            submitInput,
            submitMockShippingAddress,
            submitOrder
        } = actions;

        const { editing, step, submitting } = checkout;
        const { details } = cart;
        const ready = isCartReady(details.items_count);
        const valid = isAddressValid(details.billing_address);

        switch (stepMap[step]) {
            case stepMap.cart: {
                const stepProps = { beginCheckout, ready, submitting };

                return <Cart {...stepProps} />;
            }
            case stepMap.form: {
                const stepProps = {
                    availablePaymentMethods,
                    availableShippingMethods,
                    cart,
                    editOrder,
                    editing,
                    enterSubflow,
                    getShippingMethods,
                    isShippingInformationReady,
                    paymentMethod,
                    ready,
                    shippingMethod,
                    status,
                    submitInput,
                    submitMockShippingAddress,
                    submitOrder,
                    submitting,
                    valid
                };

                return <Form {...stepProps} />;
            }
            case stepMap.receipt: {
                return <Receipt />;
            }
            default: {
                return null;
            }
        }
    }

    render() {
        const { child, props } = this;
        const { classes } = props;

        return <div className={classes.root}>{child}</div>;
    }
}

export default classify(defaultClasses)(Flow);
