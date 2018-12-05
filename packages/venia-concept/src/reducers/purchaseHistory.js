import { handleActions } from 'redux-actions';

import actions from '../actions/purchaseHistory/actions';

const initialState = {
    items: [],
    isFetching: false
};

const reducerMap = {
    [actions.fetchPurchaseHistoryRequest]: state => ({
        ...state,
        isFetching: true
    }),
    [actions.setItems]: (state, { payload, error }) => {
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
