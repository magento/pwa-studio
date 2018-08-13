import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { bool, func, oneOf, shape } from 'prop-types';

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
        checkout: shape({
            editing: oneOf(['address', 'paymentMethod', 'shippingMethod']),
            step: oneOf(['cart', 'form', 'receipt']).isRequired,
            submitting: bool.isRequired,
            valid: bool.isRequired
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

        if (!(cart && checkout)) {
            return null;
        }

        const ready = !!cart.details.items_count;
        const actions = {
            editOrder,
            resetCheckout,
            submitCart,
            submitInput,
            submitOrder
        };

        const flowProps = { actions, checkout, ready };

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
    ({ cart, checkout }) => ({ cart, checkout }),
    mapDispatchToProps
)(Wrapper);
