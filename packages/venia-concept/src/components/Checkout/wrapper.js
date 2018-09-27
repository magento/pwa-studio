import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, func, object, oneOf, shape, string } from 'prop-types';

import {
    beginCheckout,
    editOrder,
    resetCheckout,
    submitInput,
    submitOrder
} from 'src/actions/checkout';
import Flow from './flow';

class Wrapper extends Component {
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
            resetCheckout,
            submitInput,
            submitOrder
        } = this.props;

        // ensure state slices are present
        if (!(cart && checkout)) {
            return null;
        }

        const actions = {
            beginCheckout,
            editOrder,
            resetCheckout,
            submitInput,
            submitOrder
        };

        const flowProps = { actions, cart, checkout };

        return <Flow {...flowProps} />;
    }
}

const mapDispatchToProps = {
    beginCheckout,
    editOrder,
    resetCheckout,
    submitInput,
    submitOrder
};

export default connect(
    ({ checkout }) => ({ checkout }),
    mapDispatchToProps
)(Wrapper);
