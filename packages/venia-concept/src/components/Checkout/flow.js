import React from 'react';
import { array, bool, func, object, oneOf, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import Cart from './cart';
import Form from './form';
import Receipt from './Receipt';
import defaultClasses from './flow.css';

const hasData = value => !!value;
const isCartReady = cart => cart.details && cart.details.items_count > 0;
const isCheckoutReady = checkout => {
    const {
        billingAddress,
        paymentData,
        shippingAddress,
        shippingMethod
    } = checkout;

    return [billingAddress, paymentData, shippingAddress, shippingMethod].every(
        hasData
    );
};

const Flow = props => {
    const {
        // state
        cart,
        checkout,
        directory,
        user,

        // actions
        beginCheckout,
        cancelCheckout,
        editOrder,
        submitShippingAddress,
        submitOrder,
        submitPaymentMethodAndBillingAddress,
        submitShippingMethod
    } = props;

    const {
        availableShippingMethods,
        billingAddress,
        editing,
        incorrectAddressMessage,
        isAddressIncorrect,
        paymentData,
        shippingAddress,
        shippingMethod,
        shippingTitle,
        step,
        submitting
    } = checkout;

    // ensure state slices are present
    if (!(cart && checkout)) {
        return null;
    }

    const classes = mergeClasses(defaultClasses, props.classes);

    let child;

    switch (step) {
        case 'cart': {
            const stepProps = {
                beginCheckout,
                ready: isCartReady(cart),
                submitting
            };

            child = <Cart {...stepProps} />;
            break;
        }
        case 'form': {
            const stepProps = {
                availableShippingMethods,
                billingAddress,
                cancelCheckout,
                cart,
                directory,
                editOrder,
                editing,
                hasPaymentMethod: hasData(paymentData),
                hasShippingAddress: hasData(shippingAddress),
                hasShippingMethod: hasData(shippingMethod),
                incorrectAddressMessage,
                isAddressIncorrect,
                paymentData,
                ready: isCheckoutReady(checkout),
                shippingAddress,
                shippingMethod,
                shippingTitle,
                submitShippingAddress,
                submitOrder,
                submitPaymentMethodAndBillingAddress,
                submitShippingMethod,
                submitting
            };

            child = <Form {...stepProps} />;
            break;
        }
        case 'receipt': {
            const stepProps = {
                user
            };

            child = <Receipt {...stepProps} />;
            break;
        }
        default: {
            child = null;
        }
    }

    return <div className={classes.root}>{child}</div>;
};

Flow.propTypes = {
    beginCheckout: func,
    cancelCheckout: func,
    cart: shape({
        details: object.isRequired
    }),
    checkout: shape({
        availableShippingMethods: array,
        billingAddress: object,
        editing: oneOf(['address', 'paymentMethod', 'shippingMethod']),
        incorrectAddressMessage: string,
        isAddressIncorrect: bool,
        paymentData: object,
        shippingAddress: object,
        shippingMethod: string,
        shippingTitle: string,
        step: oneOf(['cart', 'form', 'receipt']).isRequired,
        submitting: bool
    }).isRequired,
    classes: shape({
        root: string
    }),
    directory: object,
    editOrder: func,
    submitOrder: func,
    submitPaymentMethodAndBillingAddress: func,
    submitShippingAddress: func,
    submitShippingMethod: func,
    user: object
};

export default Flow;
