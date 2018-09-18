import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { bool, func, shape, string } from 'prop-types';

import {
    enterSubflow,
    requestOrder,
    resetCheckout,
    submitOrder
} from 'src/actions/checkout';
import CheckoutFlow from './flow';

const isReady = checkout => !!checkout.shippingInformation;

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
            enterSubflow,
            requestOrder,
            resetCheckout,
            submitOrder
        } = this.props;

        const flowProps = {
            enterSubflow,
            ready: isReady(checkout),
            requestOrder,
            resetCheckout,
            status: checkout.status,
            submitOrder
        };

        return <CheckoutFlow {...flowProps} />;
    }
}

const mapStateToProps = ({ checkout }) => ({ checkout });

const mapDispatchToProps = {
    enterSubflow,
    requestOrder,
    resetCheckout,
    submitOrder
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutWrapper);
