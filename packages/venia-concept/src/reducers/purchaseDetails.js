import { handleActions } from 'redux-actions';
import actions from 'src/actions/purchaseDetails';

const initialState = {
    item: {},
    otherItems: [],
    orderDetails: {},
    isFetching: false
};

const reducerMap = {
    [actions.request]: state => {
        return {
            ...state,
            isFetching: true
        };
    },
    [actions.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                isFetching: false
            };
        }

        return {
            ...state,
            ...payload,
            isFetching: false
        };
    }
};

export default handleActions(reducerMap, initialState);
