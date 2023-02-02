import React, { useCallback } from 'react';
import { func, shape, string } from 'prop-types';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { gql } from '@apollo/client';

import { useToasts } from '@magento/peregrine';
import { useFlow } from '@magento/peregrine/lib/talons/Checkout/useFlow';

import { useStyle } from '../../classify';
import isObjectEmpty from '../../util/isObjectEmpty';
import Icon from '../Icon';
import CheckoutButton from './checkoutButton';
import Form from './form';
import Receipt from './Receipt';

import defaultClasses from './flow.module.css';

const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

/**
 * This Flow component's primary purpose is to take relevant state and actions
 * and pass them to the current checkout step.
 */
const Flow = props => {
    const { setStep, step } = props;
    const [, { addToast }] = useToasts();
    const onSubmitError = useCallback(() => {
        addToast({
            type: 'error',
            icon: ErrorIcon,
            message:
                'Something went wrong submitting your order! Try again later.',
            timeout: 7000
        });
    }, [addToast]);

    const talonProps = useFlow({
        createCartMutation: CREATE_CART_MUTATION,
        onSubmitError,
        setStep: props.setStep
    });

    const {
        cartState,
        checkoutDisabled,
        checkoutState,
        isReady,
        submitPaymentMethodAndBillingAddress,
        submitShippingMethod,
        handleBeginCheckout,
        handleCancelCheckout,
        handleCloseReceipt,
        handleSubmitOrder
    } = talonProps;

    const {
        availableShippingMethods,
        billingAddress,
        isSubmitting,
        paymentData,
        shippingAddress,
        shippingAddressError,
        shippingMethod
    } = checkoutState;

    const classes = useStyle(defaultClasses, props.classes);

    let child;
    switch (step) {
        case 'cart': {
            child = (
                <div className={classes.footer}>
                    <CheckoutButton
                        disabled={checkoutDisabled}
                        onClick={handleBeginCheckout}
                    />
                </div>
            );
            break;
        }
        case 'form': {
            const stepProps = {
                availableShippingMethods,
                billingAddress,
                cancelCheckout: handleCancelCheckout,
                cart: cartState,
                checkout: checkoutState,
                hasPaymentMethod: !!paymentData && !isObjectEmpty(paymentData),
                hasShippingAddress:
                    !!shippingAddress && !isObjectEmpty(shippingAddress),
                hasShippingMethod:
                    !!shippingMethod && !isObjectEmpty(shippingMethod),
                isSubmitting,
                paymentData,
                ready: isReady,
                setStep,
                shippingAddressError,
                shippingMethod,
                submitOrder: handleSubmitOrder,
                submitPaymentMethodAndBillingAddress,
                submitShippingMethod
            };

            child = <Form {...stepProps} />;
            break;
        }
        case 'receipt': {
            child = <Receipt onClose={handleCloseReceipt} />;
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
    }),
    setStep: func,
    step: string
};

export default Flow;

export const CREATE_CART_MUTATION = gql`
    mutation createCart {
        cartId: createEmptyCart
    }
`;
