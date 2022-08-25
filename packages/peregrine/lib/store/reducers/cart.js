import { handleActions } from 'redux-actions';

import actions from '../actions/cart';

export const name = 'cart';

export const initialState = {
    addItemError: null,
    cartId: null,
    details: {},
    detailsError: null,
    getCartError: null,
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
            return {
                ...initialState,
                getCartError: payload
            };
        }

        return {
            ...state,
            cartId: String(payload),
            getCartError: null
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
            // The only time we should spread the payload into the cart store
            // is after we've fetched cart details.
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

        // We don't actually have to update any items here
        // because we force a refresh from the server.
        return {
            ...state,
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
            ...state
        };
    },
    [actions.reset]: () => initialState
};

export default handleActions(reducerMap, initialState);
