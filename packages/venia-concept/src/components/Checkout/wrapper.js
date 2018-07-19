import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { bool, func, shape, string } from 'prop-types';

import timeout from 'src/util/timeout';
import CheckoutFlow from './flow';

const delay = 1000;

const resetCheckoutAction = () => async dispatch => {
    dispatch({ type: 'TOGGLE_DRAWER', payload: null });
    await timeout(192); // drawer transition duration
    dispatch({ type: 'RESET_CHECKOUT' });
};

const requestOrderAction = () => async dispatch => {
    dispatch({ type: 'REQUEST_ORDER' });
    await timeout(delay); // TODO: replace with api call
    dispatch({ type: 'RECEIVE_ORDER' });
};

const submitOrderAction = () => async dispatch => {
    dispatch({ type: 'SUBMIT_ORDER' });
    await timeout(delay); // TODO: replace with api call
    dispatch({ type: 'ACCEPT_ORDER' });
};

const updateOrderAction = payload => async dispatch => {
    dispatch({ payload, type: 'UPDATE_ORDER' });
    await timeout(delay); // TODO: replace with api call
    dispatch({ type: 'EXIT_SUBFLOW' });
};

class CheckoutWrapper extends Component {
    static propTypes = {
        checkout: shape({
            flow: shape({
                busy: bool.isRequired,
                step: string.isRequired
            }).isRequired,
            subflow: shape({
                busy: bool.isRequired,
                step: string.isRequired
            }).isRequired
        }).isRequired,
        enterSubflow: func.isRequired,
        resetCheckout: func.isRequired,
        requestOrder: func.isRequired,
        submitOrder: func.isRequired,
        updateOrder: func.isRequired
    };

    render() {
        const {
            checkout,
            enterSubflow,
            resetCheckout,
            requestOrder,
            submitOrder,
            updateOrder
        } = this.props;

        const flowProps = {
            busy: checkout.flow.busy,
            enterSubflow,
            resetCheckout,
            requestOrder,
            step: checkout.flow.step,
            subflow: checkout.subflow,
            submitOrder,
            updateOrder
        };

        return <CheckoutFlow {...flowProps} />;
    }
}

const mapStateToProps = ({ checkout }) => ({ checkout });

const mapDispatchToProps = dispatch => ({
    enterSubflow: payload => dispatch({ type: 'ENTER_SUBFLOW', payload }),
    resetCheckout: () => dispatch(resetCheckoutAction()),
    requestOrder: () => dispatch(requestOrderAction()),
    submitOrder: () => dispatch(submitOrderAction()),
    updateOrder: () => dispatch(updateOrderAction())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutWrapper);
