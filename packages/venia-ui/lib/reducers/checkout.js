import { handleActions } from 'redux-actions';
import actions from '../actions/checkout';

export const name = 'checkout';

const initialState = {
    availableShippingMethods: [],
    billingAddress: null,
    paymentCode: '',
    paymentData: null,
    shippingAddress: null,
    shippingMethod: '',
    shippingTitle: ''
};

const reducerMap = {
    [actions.begin]: (state, { payload }) => {
        return {
            ...state,
            ...payload
        };
    },
    [actions.billingAddress.submit]: state => state,
    [actions.billingAddress.accept]: (state, { payload }) => {
        // Billing address can either be an object with address props OR
        // an object with a single prop, `sameAsShippingAddress`, so we need
        // to do some special handling to make sure the store reflects that.
        const newState = {
            ...state
        };
        if (payload.sameAsShippingAddress) {
            newState.billingAddress = {
                ...payload
            };
        } else if (!payload.sameAsShippingAddress) {
            newState.billingAddress = {
                ...payload,
                street: [...payload.street]
            };
        }
        return newState;
    },
    [actions.billingAddress.reject]: state => state,
    [actions.getShippingMethods.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            availableShippingMethods: payload.map(method => ({
                ...method,
                code: method.carrier_code,
                title: method.carrier_title
            }))
        };
    },
    [actions.shippingAddress.submit]: state => state,
    [actions.shippingAddress.accept]: (state, { payload }) => {
        return {
            ...state,
            shippingAddress: {
                ...state.shippingAddress,
                ...payload,
                street: [...payload.street]
            }
        };
    },
    [actions.shippingAddress.reject]: state => state,
    [actions.paymentMethod.submit]: state => state,
    [actions.paymentMethod.accept]: (state, { payload }) => {
        return {
            ...state,
            paymentCode: payload.code,
            paymentData: payload.data
        };
    },
    [actions.paymentMethod.reject]: state => state,
    [actions.shippingMethod.submit]: state => state,
    [actions.shippingMethod.accept]: (state, { payload }) => {
        return {
            ...state,
            shippingMethod: payload.carrier_code,
            shippingTitle: payload.carrier_title
        };
    },
    [actions.shippingMethod.reject]: state => state,
    [actions.order.submit]: state => state,
    [actions.order.accept]: state => state,
    [actions.order.reject]: state => state,
    [actions.reset]: () => initialState
};

export default handleActions(reducerMap, initialState);
