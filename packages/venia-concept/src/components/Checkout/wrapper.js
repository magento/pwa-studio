import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, func, object, oneOf, shape, string } from 'prop-types';

import { getShippingMethods } from 'src/actions/cart';
import {
    beginCheckout,
    editOrder,
    resetCheckout,
    submitAddress,
    submitOrder,
    submitPaymentMethod,
    submitShippingMethod
} from 'src/actions/checkout';

import Flow from './flow';

const isAddressValid = address => !!(address && address.email);
const isCartReady = cart => cart.details.items_count > 0;
const isCheckoutReady = (cart, checkout) =>
    isPaymentMethodReady(checkout) &&
    isShippingInfoReady(cart, checkout) &&
    isShippingMethodReady(checkout);
const isPaymentMethodReady = checkout => !!checkout.paymentMethod;
const isShippingInfoReady = cart =>
    isAddressValid(cart.details.billing_address);

const isShippingMethodReady = checkout => !!checkout.shippingMethod;

class CheckoutWrapper extends Component {
    static propTypes = {
        beginCheckout: func.isRequired,
        cart: shape({
            details: object,
            guestCartId: string,
            totals: object
        }),
        checkout: shape({
            editing: oneOf(['address', 'paymentMethod', 'shippingMethod']),
            paymentMethod: string,
            paymentTitle: string,
            shippingMethod: string,
            shippingTitle: string,
            status: string,
            step: oneOf(['cart', 'form', 'receipt']).isRequired,
            submitting: bool.isRequired
        }),
        editOrder: func.isRequired,
        resetCheckout: func.isRequired,
        submitAddress: func.isRequired,
        submitOrder: func.isRequired,
        submitPaymentMethod: func.isRequired,
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
            submitAddress,
            submitOrder,
            submitPaymentMethod,
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
            submitAddress,
            submitOrder,
            submitPaymentMethod,
            submitShippingMethod
        };

        const {
            paymentMethods: availablePaymentMethods,
            shippingMethods: availableShippingMethods
        } = cart;
        const {
            paymentMethod,
            paymentTitle,
            shippingMethod,
            shippingTitle,
            status
        } = checkout;

        const miscProps = {
            availablePaymentMethods,
            availableShippingMethods,
            isCartReady: isCartReady(cart),
            isCheckoutReady: isCheckoutReady(cart, checkout),
            isPaymentMethodReady: isPaymentMethodReady(checkout),
            isShippingInformationReady: isShippingInfoReady(cart),
            isShippingMethodReady: isShippingMethodReady(checkout),
            paymentMethod,
            paymentTitle,
            shippingMethod,
            shippingTitle,
            status
        };

        const flowProps = { actions, cart, checkout, ...miscProps };

        return <Flow {...flowProps} />;
    }
}

const mapStateToProps = ({ checkout, cart }) => ({ checkout, cart });

const mapDispatchToProps = {
    beginCheckout,
    editOrder,
    getShippingMethods,
    resetCheckout,
    submitAddress,
    submitOrder,
    submitPaymentMethod,
    submitShippingMethod
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutWrapper);
