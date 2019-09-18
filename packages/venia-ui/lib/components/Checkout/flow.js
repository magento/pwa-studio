import React, { useCallback } from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import Cart from './cart';
import Form from './form';
import Receipt from './Receipt';
import defaultClasses from './flow.css';
import isObjectEmpty from '../../util/isObjectEmpty';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useCheckoutContext } from '@magento/peregrine/lib/context/checkout';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useToasts } from '@magento/peregrine';
import Icon from '../Icon';

import { AlertCircle as AlertCircleIcon } from 'react-feather';
const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

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
    const [cart] = useCartContext();
    const [
        checkoutState,
        {
            beginCheckout,
            cancelCheckout,
            submitOrder,
            submitPaymentMethodAndBillingAddress,
            submitShippingAddress,
            submitShippingMethod
        }
    ] = useCheckoutContext();
    const [user] = useUserContext();

    const { step, setStep } = props;

    const {
        availableShippingMethods,
        billingAddress,
        isSubmitting,
        paymentData,
        shippingAddress,
        shippingAddressError,
        shippingMethod,
        shippingTitle
    } = checkoutState;

    const classes = mergeClasses(defaultClasses, props.classes);

    let child;
    const [, { addToast }] = useToasts();
    const handleBeginCheckout = useCallback(async () => {
        await beginCheckout();
        setStep('form');
    }, [beginCheckout, setStep]);

    const handleCancelCheckout = useCallback(async () => {
        await cancelCheckout();
        setStep('cart');
    }, [cancelCheckout, setStep]);

    const handleSubmitOrder = useCallback(async () => {
        try {
            await submitOrder();
            setStep('receipt');
        } catch (e) {
            addToast({
                type: 'error',
                icon: ErrorIcon,
                message:
                    'Something went wrong submitting your order! Try again later.',
                timeout: 7000
            });
        }
    }, [addToast, setStep, submitOrder]);

    const handleCloseReceipt = useCallback(() => {
        setStep('cart');
    }, [setStep]);

    switch (step) {
        case 'cart': {
            const stepProps = {
                beginCheckout: handleBeginCheckout,
                ready: !isSubmitting && isCartReady(cart)
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
                checkout: checkoutState,
                hasPaymentMethod: !!paymentData && !isObjectEmpty(paymentData),
                hasShippingAddress:
                    !!shippingAddress && !isObjectEmpty(shippingAddress),
                hasShippingMethod:
                    !!shippingMethod && !isObjectEmpty(shippingMethod),
                isSubmitting,
                paymentData,
                ready: isCheckoutReady(checkoutState),
                shippingAddress,
                shippingAddressError,
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
                user,
                onClose: handleCloseReceipt
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
    classes: shape({
        root: string
    })
};

export default Flow;
