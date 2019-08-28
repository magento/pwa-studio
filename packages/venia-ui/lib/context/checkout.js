import React, { createContext, useMemo } from 'react';

import {
    beginCheckout,
    cancelCheckout,
    getShippingMethods,
    resetCheckout,
    submitBillingAddress,
    submitOrder,
    submitPaymentMethod,
    submitPaymentMethodAndBillingAddress,
    submitShippingAddress,
    submitShippingMethod
} from '../actions/checkout';
import { connect } from '../drivers';

export const CheckoutContext = createContext();

const CheckoutContextProvider = props => {
    const {
        beginCheckout,
        cancelCheckout,
        checkout: checkoutState,
        children,
        getShippingMethods,
        resetCheckout,
        submitBillingAddress,
        submitOrder,
        submitPaymentMethod,
        submitPaymentMethodAndBillingAddress,
        submitShippingAddress,
        submitShippingMethod
    } = props;

    const checkoutApi = useMemo(
        () => ({
            beginCheckout,
            cancelCheckout,
            getShippingMethods,
            resetCheckout,
            submitBillingAddress,
            submitOrder,
            submitPaymentMethod,
            submitPaymentMethodAndBillingAddress,
            submitShippingAddress,
            submitShippingMethod
        }),
        [
            beginCheckout,
            cancelCheckout,
            getShippingMethods,
            resetCheckout,
            submitBillingAddress,
            submitOrder,
            submitPaymentMethod,
            submitPaymentMethodAndBillingAddress,
            submitShippingAddress,
            submitShippingMethod
        ]
    );

    const contextValue = useMemo(() => [checkoutState, checkoutApi], [
        checkoutApi,
        checkoutState
    ]);

    return (
        <CheckoutContext.Provider value={contextValue}>
            {children}
        </CheckoutContext.Provider>
    );
};

const mapStateToProps = ({ checkout }) => ({ checkout });

const mapDispatchToProps = {
    beginCheckout,
    cancelCheckout,
    getShippingMethods,
    resetCheckout,
    submitBillingAddress,
    submitOrder,
    submitPaymentMethod,
    submitPaymentMethodAndBillingAddress,
    submitShippingAddress,
    submitShippingMethod
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutContextProvider);
