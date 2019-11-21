import { handleActions } from 'redux-actions';

import actions from '../actions/cart';
import checkoutActions from '../actions/checkout';
import { Util } from '../../index';

const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const name = 'cart';

export const initialState = {
    addItemError: null,
    cartId: storage.getItem('cartId') || null,
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
    [actions.updateItem.request]: (state, { payload }) => {
        return {
            ...state,
            ...payload,
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
                ...initialState,
                removeItemError: payload
            };
        }
        // If we are emptying the cart, perform a reset to prevent
        // a bug where the next item added to cart would have a price of 0
        if (payload.cartItemCount == 1) {
            return initialState;
        }
        return {
            ...state,
            ...payload
        };
    },
    [checkoutActions.order.accept]: () => {
        return {
            ...initialState,
            // The initial cartId from storage is no longer valid.
            cartId: null
        };
    },
    [actions.reset]: () => {
        return {
            ...initialState,
            // The initial cartId from storage is no longer valid.
            cartId: null
        };
    }
};

export default handleActions(reducerMap, initialState);
