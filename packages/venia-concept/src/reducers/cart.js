import { handleActions } from 'redux-actions';

import actions from 'src/actions/cart';
import checkoutActions from 'src/actions/checkout';

export const name = 'cart';

export const initialState = {
    details: {},
    loading: false,
    guestCartId: null,
    paymentMethods: [],
    shippingMethods: [],
    totals: {}
};

const reducerMap = {
    [actions.getGuestCart.receive]: (state, { payload, error }) => {
        if (error) {
            return initialState;
        }

        return {
            ...state,
            guestCartId: payload
        };
    },
    [actions.getDetails.request]: (state, { payload }) => {
        return {
            ...state,
            guestCartId: payload,
            loading: true
        };
    },
    [actions.getDetails.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                loading: false,
                guestCartId: null
            };
        }

        return {
            ...state,
            ...payload,
            loading: false
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
    [checkoutActions.order.accept]: () => {
        return initialState;
    }
};

export default handleActions(reducerMap, initialState);
