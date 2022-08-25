import { handleActions } from 'redux-actions';
import actions from '../actions/checkout';

export const name = 'checkout';

const initialState = {
    availableShippingMethods: [],
    billingAddress: null,
    billingAddressError: null,
    isSubmitting: false,
    orderError: null,
    paymentMethodError: null,
    paymentCode: '',
    paymentData: null,
    receipt: {
        order: {}
    },
    shippingAddress: {},
    shippingAddressError: null,
    shippingMethod: '',
    shippingMethodError: null,
    shippingTitle: ''
};

const reducerMap = {
    [actions.begin]: (state, { payload }) => {
        return {
            ...state,
            ...payload
        };
    },
    [actions.billingAddress.submit]: state => ({
        ...state,
        billingAddressError: null,
        isSubmitting: true
    }),
    [actions.billingAddress.accept]: (state, { payload }) => {
        // Billing address can either be an object with address props OR
        // an object with a single prop, `sameAsShippingAddress`, so we need
        // to do some special handling to make sure the store reflects that.
        const newState = {
            ...state,
            isSubmitting: false
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
    [actions.billingAddress.reject]: (state, { payload }) => {
        return {
            ...state,
            billingAddressError: payload,
            isSubmitting: false
        };
    },
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
    [actions.shippingAddress.submit]: state => ({
        ...state,
        isSubmitting: true,
        shippingAddressError: null
    }),
    [actions.shippingAddress.accept]: (state, { payload }) => {
        return {
            ...state,
            isSubmitting: false,
            shippingAddress: {
                ...state.shippingAddress,
                ...payload,
                street: [...payload.street]
            }
        };
    },
    [actions.shippingAddress.reject]: (state, { payload }) => {
        return {
            ...state,
            isSubmitting: false,
            shippingAddressError: payload
        };
    },
    [actions.paymentMethod.submit]: state => ({
        ...state,
        isSubmitting: true,
        paymentMethodError: null
    }),
    [actions.paymentMethod.accept]: (state, { payload }) => {
        return {
            ...state,
            isSubmitting: false,
            paymentCode: payload.code,
            paymentData: payload.data
        };
    },
    [actions.paymentMethod.reject]: (state, { payload }) => {
        return {
            ...state,
            isSubmitting: false,
            paymentMethodError: payload
        };
    },
    [actions.receipt.setOrder]: (state, { payload }) => ({
        ...state,
        receipt: {
            order: payload
        }
    }),
    [actions.receipt.reset]: state => ({
        ...state,
        receipt: {
            ...initialState.receipt
        }
    }),
    [actions.shippingMethod.submit]: state => ({
        ...state,
        isSubmitting: true,
        shippingMethodError: null
    }),
    [actions.shippingMethod.accept]: (state, { payload }) => {
        return {
            ...state,
            isSubmitting: false,
            shippingMethod: payload.carrier_code,
            shippingTitle: payload.carrier_title
        };
    },
    [actions.shippingMethod.reject]: (state, { payload }) => {
        return {
            ...state,
            isSubmitting: false,
            shippingMethodError: payload
        };
    },
    [actions.order.submit]: state => ({
        ...state,
        isSubmitting: true,
        orderError: null
    }),
    [actions.order.accept]: state => ({
        ...state,
        isSubmitting: false
    }),
    [actions.order.reject]: (state, { payload }) => {
        return {
            ...state,
            isSubmitting: false,
            orderError: payload
        };
    },
    [actions.reset]: () => initialState
};

export default handleActions(reducerMap, initialState);
