import React, { Component } from 'react';
import { connect } from 'react-redux';
import { array, bool, func, object, oneOf, shape, string } from 'prop-types';

import { Util } from '@magento/peregrine';
import { getShippingMethods } from 'src/actions/cart';
import {
    beginCheckout,
    editOrder,
    resetCheckout,
    submitShippingAddress,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod
} from 'src/actions/checkout';

import Flow from './flow';

const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

const isAddressValid = address => !!(address && address.email);
const isCartReady = cart => cart.details.items_count > 0;
const isCheckoutReady = checkout => {
    return (
        isPaymentMethodReady() &&
        isShippingInfoReady() &&
        isShippingMethodReady(checkout)
    );
};
const isPaymentMethodReady = () => {
    const paymentMethod = storage.getItem('paymentMethod');
    return !!paymentMethod;
};
const isShippingInfoReady = () => {
    const address = storage.getItem('shipping_address');
    return isAddressValid(address);
};
const isShippingMethodReady = checkout => !!checkout.shippingMethod;

class CheckoutWrapper extends Component {
    static propTypes = {
        beginCheckout: func.isRequired,
        cart: shape({
            details: object,
            guestCartId: string,
            shippingMethods: array,
            totals: object
        }),
        checkout: shape({
            editing: oneOf(['address', 'paymentMethod', 'shippingMethod']),
            paymentData: shape({
                description: string,
                details: shape({
                    cardType: string
                }),
                nonce: string
            }),
            shippingMethod: string,
            shippingTitle: string,
            step: oneOf(['cart', 'form', 'receipt']).isRequired,
            submitting: bool.isRequired
        }),
        editOrder: func.isRequired,
        resetCheckout: func.isRequired,
        submitShippingAddress: func.isRequired,
        submitOrder: func.isRequired,
        submitPaymentMethodAndBillingAddress: func.isRequired,
        submitShippingMethod: func.isRequired
    };

    render() {
        const {
            cart,
            checkout,

            beginCheckout,
            editOrder,
            getShippingMethods,
            requestOrder,
            resetCheckout,
            submitShippingAddress,
            submitOrder,
            submitPaymentMethodAndBillingAddress,
            submitShippingMethod
        } = this.props;

        // ensure state slices are present
        if (!(cart && checkout)) {
            return null;
        }

        const actions = {
            beginCheckout,
            editOrder,
            getShippingMethods,
            requestOrder,
            resetCheckout,
            submitShippingAddress,
            submitOrder,
            submitPaymentMethodAndBillingAddress,
            submitShippingMethod
        };

        const { shippingMethods: availableShippingMethods } = cart;
        const { paymentData, shippingMethod, shippingTitle } = checkout;

        const miscProps = {
            availableShippingMethods,
            isCartReady: isCartReady(cart),
            isCheckoutReady: isCheckoutReady(checkout),
            isPaymentMethodReady: isPaymentMethodReady(),
            isShippingInformationReady: isShippingInfoReady(),
            isShippingMethodReady: isShippingMethodReady(checkout),
            paymentData,
            shippingMethod,
            shippingTitle
        };

        const flowProps = { actions, cart, checkout, ...miscProps };

        return <Flow {...flowProps} />;
    }
}

const mapStateToProps = ({ cart, checkout }) => ({ cart, checkout });

const mapDispatchToProps = {
    beginCheckout,
    editOrder,
    getShippingMethods,
    resetCheckout,
    submitShippingAddress,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutWrapper);
