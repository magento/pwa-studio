import React, { useCallback } from 'react';
import { array, bool, func, number, object, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import Cart from './cart';
import Form from './form';
import Receipt from './Receipt';
import defaultClasses from './flow.css';
import isObjectEmpty from '../../util/isObjectEmpty';

const isCartReady = cart => cart.details && cart.details.items_count > 0;
const isCheckoutReady = checkout => {
    const {
        billingAddress,
        paymentData,
        shippingAddress,
        shippingMethod
    } = checkout;

    const objectsHaveData = [
        billingAddress,
        paymentData,
        shippingAddress
    ].every(data => {
        return !!data && !isObjectEmpty(data);
    });

    const stringsHaveData = !!shippingMethod && shippingMethod.length > 0;

    return objectsHaveData && stringsHaveData;
};

/**
 * This Flow component's primary purpose is to take relevant state and actions
 * and pass them to the current checkout step.
 */
const Flow = props => {
    const {
        // state
        cart,
        checkout,
        directory,
        step,
        user,

        // actions
        beginCheckout,
        cancelCheckout,
        setStep,
        submitShippingAddress,
        submitOrder,
        submitPaymentMethodAndBillingAddress,
        submitShippingMethod
    } = props;

    const {
        availableShippingMethods,
        billingAddress,
        paymentData,
        shippingAddress,
        shippingMethod,
        shippingTitle
    } = checkout;

    const classes = mergeClasses(defaultClasses, props.classes);

    let child;

    const handleBeginCheckout = useCallback(async () => {
        await beginCheckout();
        setStep('form');
    }, [beginCheckout, setStep]);

    const handleCancelCheckout = useCallback(async () => {
        await cancelCheckout();
        setStep('cart');
    }, [cancelCheckout, setStep]);

    const handleSubmitOrder = useCallback(async () => {
        await submitOrder();
        setStep('receipt');
    }, [setStep, submitOrder]);

    switch (step) {
        case 'cart': {
            const stepProps = {
                beginCheckout: handleBeginCheckout,
                ready: isCartReady(cart)
            };

            child = <Cart {...stepProps} />;
            break;
        }
        case 'form': {
            const stepProps = {
                availableShippingMethods,
                billingAddress,
                cancelCheckout: handleCancelCheckout,
                cart,
                directory,
                hasPaymentMethod: !!paymentData && !isObjectEmpty(paymentData),
                hasShippingAddress:
                    !!shippingAddress && !isObjectEmpty(shippingAddress),
                hasShippingMethod:
                    !!shippingMethod && !isObjectEmpty(shippingMethod),
                paymentData,
                ready: isCheckoutReady(checkout),
                shippingAddress,
                shippingMethod,
                shippingTitle,
                submitShippingAddress,
                submitOrder: handleSubmitOrder,
                submitPaymentMethodAndBillingAddress,
                submitShippingMethod
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
        details: shape({
            items_count: number
        })
    }),
    checkout: shape({
        availableShippingMethods: array,
        billingAddress: object,
        invalidAddressMessage: string,
        isAddressInvalid: bool,
        paymentData: object,
        shippingAddress: object,
        shippingMethod: string,
        shippingTitle: string
    }).isRequired,
    classes: shape({
        root: string
    }),
    directory: object,
    submitOrder: func,
    submitPaymentMethodAndBillingAddress: func,
    submitShippingAddress: func,
    submitShippingMethod: func,
    user: object
};

export default Flow;
