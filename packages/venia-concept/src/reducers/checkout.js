import { handleActions } from 'redux-actions';

import actions from 'src/actions/checkout';

export const name = 'checkout';

const initialState = {
    editing: null,
    step: 'cart',
    submitting: false,
    shippingInformation: false,
    shippingMethod: null,
    paymentMethod: null,
    paymentTitle: null,
    status: 'READY',
    subflow: null,
};

const reducerMap = {
    [actions.begin]: state => {
        return {
            ...state,
            editing: null,
            step: 'form'
        };
    },
    [actions.edit]: (state, { payload }) => {
        return {
            ...state,
            editing: payload
        };
    },
    [actions.input.submit]: state => {
        return {
            ...state,
            submitting: true
        };
    },
    [actions.input.accept]: state => {
        return {
            ...state,
            editing: null,
            step: 'form',
            submitting: false
        };
    },
    [actions.input.reject]: state => {
        return {
            ...state,
            submitting: false
        };
    },
    [actions.order.submit]: state => {
        return {
            ...state,
            submitting: true
        };
    },
    [actions.order.accept]: state => {
        return {
            ...state,
            editing: null,
            step: 'receipt',
            submitting: false
        };
    },
    [actions.order.reject]: state => {
        return {
            ...state,
            submitting: false
        };
    },
    [actions.reset]: () => initialState,

    'ENTER_SUBFLOW': (state, { payload }) => {
        return {
            ...state,
            status: 'MODIFYING',
            subflow: payload
        };
    },
    'EXIT_SUBFLOW': state => {
        return {
            ...state,
            status: 'MODIFYING',
            subflow: null
        };
    },
    'SUBMIT_SHIPPING_INFORMATION': state => {
        return {
            ...state,
            shippingInformation: true
        };
    },
    'SUBMIT_PAYMENT_INFORMATION': (state, { payload }) => {
        return {
            ...state,
            paymentMethod: payload.code,
            paymentTitle: payload.title
        };
    },
    'SUBMIT_SHIPPING_METHOD': (state, { payload }) => {
        return {
            ...state,
            shippingMethod: payload.carrier_title
        };
    },
};

export default handleActions(reducerMap, initialState);
