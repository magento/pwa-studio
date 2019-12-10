import { handleActions } from 'redux-actions';

import actions from '../actions/cart';
import checkoutActions from '../actions/checkout';

export const name = 'cart';

export const initialState = {
    addItemError: null,
    cartId: null,
    details: {},
    detailsError: null,
    isLoading: false,
    isUpdatingItem: false,
    isAddingItem: false,
    paymentMethods: [],
    removeItemError: null,
    shippingMethods: [],
    totals: {},
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
