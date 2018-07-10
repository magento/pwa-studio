import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { func, shape, string } from 'prop-types';

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
            checkout,
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

const mapDispatchToProps = dispatch => ({
    enterSubflow: payload => dispatch({ type: 'ENTER_SUBFLOW', payload }),
    resetCheckout: () => dispatch(resetCheckoutAction()),
    requestOrder: () => dispatch(requestOrderAction()),
    submitOrder: () => dispatch(submitOrderAction())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutWrapper);
