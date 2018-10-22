import { handleActions } from 'redux-actions';
import actions from './actions';

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
