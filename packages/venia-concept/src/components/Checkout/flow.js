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

class Flow extends Component {
    static propTypes = {
        actions: shape({
            beginCheckout: func.isRequired,
            editOrder: func.isRequired,
            getShippingMethods: func.isRequired,
            resetCheckout: func.isRequired,
            submitShippingAddress: func.isRequired,
            submitOrder: func.isRequired,
            submitPaymentMethodAndBillingAddress: func.isRequired,
            submitShippingMethod: func.isRequired
        }).isRequired,
        availableShippingMethods: array,
        cart: shape({
            details: object,
            guestCartId: string,
            totals: object
        }),
        checkout: shape({
            editing: string,
            incorrectAddressMessage: string,
            isAddressIncorrect: bool,
            step: string,
            submitting: bool
        }),
        directory: shape({
            countries: array
        }),
        classes: shape({
            root: string
        }),
        isCartReady: bool,
        isCheckoutReady: bool,
        isPaymentMethodReady: bool,
        isShippingInformationReady: bool,
        isShippingMethodReady: bool,
        paymentData: shape({
            description: string,
            details: shape({
                cardType: string
            }),
            nonce: string
        }),
        shippingMethod: string,
        shippingTitle: string
    };

    get child() {
        const {
            actions,
            availableShippingMethods,
            cart,
            checkout,
            directory,
            isCartReady,
            isCheckoutReady,
            isPaymentMethodReady,
            isShippingInformationReady,
            isShippingMethodReady,
            paymentData,
            shippingMethod,
            shippingTitle
        } = this.props;

        const {
            beginCheckout,
            editOrder,
            getShippingMethods,
            submitShippingAddress,
            submitOrder,
            submitPaymentMethodAndBillingAddress,
            submitShippingMethod
        } = actions;

        const {
            editing,
            step,
            submitting,
            isAddressIncorrect,
            incorrectAddressMessage
        } = checkout;

        switch (stepMap[step]) {
            case stepMap.cart: {
                const stepProps = {
                    beginCheckout,
                    ready: isCartReady,
                    submitting
                };

                return <Cart {...stepProps} />;
            }
            case stepMap.form: {
                const stepProps = {
                    availableShippingMethods,
                    cart,
                    directory,
                    editOrder,
                    editing,
                    getShippingMethods,
                    ready: isCheckoutReady,
                    isPaymentMethodReady,
                    isShippingInformationReady,
                    isShippingMethodReady,
                    paymentData,
                    shippingMethod,
                    shippingTitle,
                    submitShippingAddress,
                    submitOrder,
                    submitPaymentMethodAndBillingAddress,
                    submitShippingMethod,
                    submitting
                };

                const formProps = {
                    ...stepProps,
                    incorrectAddressMessage,
                    isAddressIncorrect
                };

                return <Form {...formProps} />;
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
