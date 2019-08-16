import React, { useCallback, useState } from 'react';
import {
    array,
    bool,
    func,
    number,
    object,
    oneOf,
    shape,
    string
} from 'prop-types';

import { mergeClasses } from '../../classify';
import Cart from './cart';
import Form from './form';
import Receipt from './Receipt';
import defaultClasses from './flow.css';
import isObjectEmpty from '../../util/isObjectEmpty';
import { useCheckoutContext } from '@magento/peregrine/lib/state/Checkout';

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
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState('cart');
    const [checkoutState, checkoutApi] = useCheckoutContext();

    const {
        // STATE
        cart,
        checkout,
        user,

        // ACTIONS
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
    } = checkoutState;

    const classes = mergeClasses(defaultClasses, props.classes);

    let child;

    const handleBeginCheckout = useCallback(() => {
        checkoutApi.beginCheckout();
        setStep('form');
    }, [checkoutApi, setStep]);

    const handleCancelCheckout = useCallback(() => {
        checkoutApi.reset();
        setStep('cart');
    }, [checkoutApi, setStep]);

    switch (step) {
        case 'cart': {
            child = (
                <Cart
                    beginCheckout={handleBeginCheckout}
                    submitting={submitting}
                />
            );
            break;
        }
        case 'form': {
            const stepProps = {
                availableShippingMethods,
                billingAddress,
                cancelCheckout: handleCancelCheckout,
                cart,
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
                submitOrder,
                submitPaymentMethodAndBillingAddress,
                submitShippingMethod,
                submitting,
                setSubmitting,
                setStep
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
    cart: shape({
        details: shape({
            items_count: number
        })
    }),
    checkout: shape({
        availableShippingMethods: array,
        billingAddress: object,
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
    submitOrder: func,
    submitPaymentMethodAndBillingAddress: func,
    submitShippingMethod: func,
    user: object
};

export default Flow;
