import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { func, shape, string } from 'prop-types';

import { requestOrder, resetCheckout, submitOrder } from 'src/actions/checkout';
import CheckoutFlow from './flow';

class CheckoutWrapper extends Component {
    static propTypes = {
        checkout: shape({
            status: string
        }),
        resetCheckout: func.isRequired,
        requestOrder: func.isRequired,
        submitOrder: func.isRequired
    };

    render() {
        const {
            checkout = {},
            enterSubflow,
            resetCheckout,
            requestOrder,
            submitOrder
        } = this.props;

        const flowProps = {
            enterSubflow,
            resetCheckout,
            requestOrder,
            status: checkout.status,
            submitOrder
        };

        return <CheckoutFlow {...flowProps} />;
    }
}

const mapStateToProps = ({ checkout }) => ({ checkout });

const mapDispatchToProps = {
    enterSubflow: payload => dispatch({ type: 'ENTER_SUBFLOW', payload }),
    resetCheckout,
    requestOrder,
    submitOrder
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutWrapper);
