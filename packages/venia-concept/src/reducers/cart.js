import { handleActions } from 'redux-actions';

import actions from 'src/actions/cart';
import checkoutActions from 'src/actions/checkout';

export const name = 'cart';

export const initialState = {
    cartId: null,
    details: {},
    isLoading: false,
    isOptionsDrawerOpen: false,
    isUpdatingItem: false,
    paymentMethods: [],
    shippingMethods: [],
    totals: {}
};

const reducerMap = {
    [actions.getCart.receive]: (state, { payload, error }) => {
        if (error) {
            return initialState;
        }

        return {
            ...state,
            cartId: payload
        };
    },
    [actions.getDetails.request]: (state, { payload }) => {
        return {
            ...state,
            cartId: payload,
            isLoading: true
        };
    },
    [actions.getDetails.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                cartId: null,
                isLoading: false
            };
        }

        return {
            ...state,
            ...payload,
            isLoading: false
        };
    },
    [actions.updateItem.request]: (state, { payload, error }) => {
        if (error) {
            return initialState;
        }
        return {
            ...state,
            ...payload,
            isUpdatingItem: true
        };
    },
    [actions.updateItem.receive]: state => {
        // We don't actually have to update any items here
        // because we force a refresh from the server.
        return {
            ...state,
            isUpdatingItem: false
        };
    },
    [actions.removeItem.receive]: (state, { payload, error }) => {
        if (error) {
            return initialState;
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
    [actions.openOptionsDrawer]: state => {
        return {
            ...state,
            isOptionsDrawerOpen: true
        };
    },
    [actions.closeOptionsDrawer]: state => {
        return {
            ...state,
            isOptionsDrawerOpen: false
        };
    },
    [checkoutActions.order.accept]: () => {
        return initialState;
    }
};

export default handleActions(reducerMap, initialState);
