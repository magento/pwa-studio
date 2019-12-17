import { handleActions } from 'redux-actions';

import actions from '../actions/cart';

export const name = 'cart';

export const initialState = {
    addItemError: null,
    cartId: null,
    details: {},
    detailsError: null,
    isLoading: false,
    isUpdatingItem: false,
    isAddingItem: false,
    removeItemError: null,
    shippingMethods: [],
    updateItemError: null
};

const reducerMap = {
    [actions.getCart.receive]: (state, { payload, error }) => {
        if (error) {
            return initialState;
        }

        return {
            ...state,
            cartId: String(payload)
        };
    },
    [actions.getDetails.request]: state => {
        return {
            ...state,
            isLoading: true
        };
    },
    [actions.getDetails.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                detailsError: payload,
                isLoading: false
            };
        }

        return {
            ...state,
            ...payload,
            isLoading: false
        };
    },
    [actions.addItem.request]: state => {
        return {
            ...state,
            isAddingItem: true
        };
    },
    [actions.addItem.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                addItemError: payload,
                isAddingItem: false
            };
        }

        return {
            ...state,
            ...payload,
            isAddingItem: false
        };
    },
    [actions.updateItem.request]: state => {
        return {
            ...state,
            isUpdatingItem: true
        };
    },
    [actions.updateItem.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                isUpdatingItem: false,
                updateItemError: payload
            };
        }

        return {
            ...state,
            ...payload,
            isUpdatingItem: false
        };
    },
    [actions.removeItem.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                removeItemError: payload
            };
        }
        return {
            ...state,
            ...payload
        };
    },
    [actions.reset]: () => initialState
};

export default handleActions(reducerMap, initialState);
