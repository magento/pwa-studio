import { handleActions } from 'redux-actions';

import actions from '../actions/purchaseHistory/actions';

const initialState = {
    items: [],
    isFetching: false
};

const reducerMap = {
    [actions.getPurchaseHistory.request]: state => ({
        ...state,
        isFetching: true
    }),
    [actions.getPurchaseHistory.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                isFetching: false
            };
        }

        return {
            ...state,
            isFetching: false,
            items: payload.items
        };
    },
    [actions.reset]: () => initialState
};

export default handleActions(reducerMap, initialState);
