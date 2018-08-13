import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { bool, func, object, oneOf, shape, string } from 'prop-types';

import {
    editOrder,
    resetCheckout,
    submitCart,
    submitInput,
    submitOrder
} from 'src/actions/checkout';
import Flow from './flow';

class Wrapper extends Component {
    static propTypes = {
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
        submitCart: func.isRequired,
        submitInput: func.isRequired,
        submitOrder: func.isRequired
    };

    render() {
        const {
            cart,
            checkout,
            editOrder,
            resetCheckout,
            submitCart,
            submitInput,
            submitOrder
        } = this.props;

        // ensure state slices are present
        if (!(cart && checkout)) {
            return null;
        }

        const actions = {
            editOrder,
            resetCheckout,
            submitCart,
            submitInput,
            submitOrder
        };

        const flowProps = { actions, cart, checkout };

        return <Flow {...flowProps} />;
    }
}

const mapDispatchToProps = {
    editOrder,
    resetCheckout,
    submitCart,
    submitInput,
    submitOrder
};

export default connect(
    ({ checkout }) => ({ checkout }),
    mapDispatchToProps
)(Wrapper);
