import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, func, object, oneOf, shape, string } from 'prop-types';

import { getShippingMethods } from 'src/actions/cart';
import {
    beginCheckout,
    editOrder,
    resetCheckout,
    submitInput,
    submitMockShippingAddress,
    submitOrder,
} from 'src/actions/checkout';

import Flow from './flow';

const isReady = checkout =>
    !!checkout.shippingInformation && !!checkout.paymentMethod;
const isShippingInfoReady = checkout => !!checkout.shippingInformation;

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
            step: oneOf(['cart', 'form', 'receipt']).isRequired,
            submitting: bool.isRequired
        }),
        editOrder: func.isRequired,
        resetCheckout: func.isRequired,
        submitInput: func.isRequired,
        submitOrder: func.isRequired
    };

    render() {
        const {
            cart,
            checkout,

            beginCheckout,
            editOrder,
            enterSubflow,
            getShippingMethods,
            requestOrder,
            resetCheckout,
            submitInput,
            submitMockShippingAddress,
            submitOrder,
        } = this.props;

        // ensure state slices are present
        if (!(cart && checkout)) {
            return null;
        }

        const actions = {
            beginCheckout,
            editOrder,
            enterSubflow,
            getShippingMethods,
            requestOrder,
            resetCheckout,
            submitInput,
            submitMockShippingAddress,
            submitOrder,       
        };

        const {
            paymentMethods: availablePaymentMethods,
            shippingMethods: availableShippingMethods,
        } = cart;
        const {
            paymentTitle: paymentMethod,
            shippingMethod,
            status
        } = checkout;

        const ready = isReady(checkout);
        const isShippingInformationReady = isShippingInfoReady(checkout);
        const miscProps = {
            availablePaymentMethods,
            availableShippingMethods,
            isShippingInformationReady,
            paymentMethod,
            ready,
            shippingMethod,
            status,
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
    submitInput,
    submitMockShippingAddress,
    submitOrder,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutWrapper);
