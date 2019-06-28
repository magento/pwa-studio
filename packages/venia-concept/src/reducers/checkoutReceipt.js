import { handleActions } from 'redux-actions';
import actions from '../actions/checkoutReceipt';

const initialState = {
    order: {}
};

export default handleActions(
    {
        [actions.setOrderInformation]: (state, { payload }) => ({
            ...state,
            order: payload
        }),
        [actions.reset]: () => initialState
    },
    initialState
);
