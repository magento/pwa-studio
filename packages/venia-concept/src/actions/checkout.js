import { closeDrawer } from 'src/actions/app';
import * as durations from 'src/shared/durations';
import timeout from 'src/util/timeout';

export const resetCheckout = () => async dispatch => {
    await closeDrawer()(dispatch);
    dispatch({ type: 'RESET_CHECKOUT' });
};

export const requestOrder = () => async dispatch => {
    dispatch({ type: 'REQUEST_ORDER' });
    // TODO: replace with api call
    await timeout(durations.requestOrder);
    dispatch({ type: 'RECEIVE_ORDER' });
};

export const submitOrder = () => async dispatch => {
    dispatch({ type: 'SUBMIT_ORDER' });
    // TODO: replace with api call
    await timeout(durations.submitOrder);
    dispatch({ type: 'ACCEPT_ORDER' });
};
