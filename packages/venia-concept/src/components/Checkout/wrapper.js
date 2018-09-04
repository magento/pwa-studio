import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { bool, func, shape, string } from 'prop-types';
import { getShippingMethods } from 'src/actions/cart';

import {
    enterSubflow,
    requestOrder,
    resetCheckout,
    submitOrder,
    submitMockShippingAddress
} from 'src/actions/checkout';
import CheckoutFlow from './flow';

const isReady = checkout =>
    !!checkout.shippingInformation && !!checkout.paymentMethod;
const isShippingInformationReady = checkout => !!checkout.shippingInformation;

class CheckoutWrapper extends Component {
    static propTypes = {
        checkout: shape({
            shippingInformation: bool,
            status: string
        }),
        enterSubflow: func.isRequired,
        requestOrder: func.isRequired,
        resetCheckout: func.isRequired,
        submitOrder: func.isRequired
    };

    render() {
        const {
            checkout = {},
            cart = {},
            enterSubflow,
            requestOrder,
            resetCheckout,
            submitOrder,
            submitMockShippingAddress,
            getShippingMethods
        } = this.props;

        const flowProps = {
            enterSubflow,
            submitMockShippingAddress,
            getShippingMethods,
            ready: isReady(checkout),
            requestOrder,
            resetCheckout,
            status: checkout.status,
            submitOrder,
            paymentMethod: checkout.paymentTitle,
            availablePaymentMethods: cart.paymentMethods,
            shippingMethod: checkout.shippingMethod,
            isShippingInformationReady: isShippingInformationReady(checkout),
            availableShippingMethods: cart.shippingMethods,
            cart: cart
        };

        return <CheckoutFlow {...flowProps} />;
    }
}

const mapStateToProps = ({ checkout, cart }) => ({ checkout, cart });

const mapDispatchToProps = {
    enterSubflow,
    requestOrder,
    resetCheckout,
    submitOrder,
    getShippingMethods,
    submitMockShippingAddress
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutWrapper);
