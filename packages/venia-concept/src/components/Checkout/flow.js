import React, { Component } from 'react';
import { array, bool, func, object, oneOf, shape, string } from 'prop-types';

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
            cancelCheckout: func.isRequired,
            editOrder: func.isRequired,
            submitShippingAddress: func.isRequired,
            submitOrder: func.isRequired,
            submitPaymentMethodAndBillingAddress: func.isRequired,
            submitShippingMethod: func.isRequired
        }).isRequired,
        cart: shape({
            details: object,
            guestCartId: string,
            totals: object
        }),
        checkout: shape({
            availableShippingMethods: array,
            billingAddress: shape({
                city: string,
                country_id: string,
                email: string,
                firstname: string,
                lastname: string,
                postcode: string,
                region_id: string,
                region_code: string,
                region: string,
                street: array,
                telephone: string
            }),
            editing: oneOf(['address', 'paymentMethod', 'shippingMethod']),
            incorrectAddressMessage: string,
            isAddressIncorrect: bool,
            paymentCode: string,
            paymentData: shape({
                description: string,
                details: shape({
                    cardType: string
                }),
                nonce: string
            }),
            shippingAddress: shape({
                city: string,
                country_id: string,
                email: string,
                firstname: string,
                lastname: string,
                postcode: string,
                region_id: string,
                region_code: string,
                region: string,
                street: array,
                telephone: string
            }),
            shippingMethod: string,
            shippingTitle: string,
            step: oneOf(['cart', 'form', 'receipt']).isRequired,
            submitting: bool.isRequired
        }),
        directory: shape({
            countries: array
        }),
        classes: shape({
            root: string
        }),
        hasPaymentMethod: bool,
        hasShippingAddress: bool,
        hasShippingMethod: bool,
        isCartReady: bool,
        isCheckoutReady: bool,
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
            cart,
            checkout,
            hasPaymentMethod,
            hasShippingAddress,
            hasShippingMethod,
            directory,
            isCartReady,
            isCheckoutReady
        } = this.props;

        const {
            beginCheckout,
            cancelCheckout,
            editOrder,
            submitShippingAddress,
            submitOrder,
            submitPaymentMethodAndBillingAddress,
            submitShippingMethod
        } = actions;

        const {
            availableShippingMethods,
            billingAddress,
            editing,
            isAddressIncorrect,
            incorrectAddressMessage,
            paymentData,
            shippingAddress,
            shippingMethod,
            shippingTitle,
            step,
            submitting
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
                    billingAddress,
                    cancelCheckout,
                    cart,
                    directory,
                    editOrder,
                    editing,
                    hasPaymentMethod,
                    hasShippingAddress,
                    hasShippingMethod,
                    incorrectAddressMessage,
                    isAddressIncorrect,
                    paymentData,
                    ready: isCheckoutReady,
                    shippingAddress,
                    shippingMethod,
                    shippingTitle,
                    submitShippingAddress,
                    submitOrder,
                    submitPaymentMethodAndBillingAddress,
                    submitShippingMethod,
                    submitting
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
