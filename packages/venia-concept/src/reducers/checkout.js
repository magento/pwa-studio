import { handleActions } from 'redux-actions';

import { Util } from '@magento/peregrine';
import actions from 'src/actions/checkout';

export const name = 'checkout';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

const storedPaymentMethod = storage.getItem('paymentMethod');
const storedShippingMethod = storage.getItem('shippingMethod');

const initialState = {
    editing: null,
    paymentMethod: storedPaymentMethod && storedPaymentMethod.code,
    paymentTitle: storedPaymentMethod && storedPaymentMethod.title,
    shippingMethod: storedShippingMethod && storedShippingMethod.carrier_code,
    shippingTitle: storedShippingMethod && storedShippingMethod.carrier_title,
    status: 'READY',
    step: 'cart',
    submitting: false
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
    [actions.address.submit]: state => {
        return {
            ...state,
            submitting: true
        };
    },
    [actions.address.accept]: state => {
        return {
            ...state,
            editing: null,
            step: 'form',
            submitting: false
        };
    },
    [actions.address.reject]: state => {
        return {
            ...state,
            submitting: false
        };
    },
    [actions.paymentMethod.submit]: state => {
        return {
            ...state,
            submitting: true
        };
    },
    [actions.paymentMethod.accept]: (state, { payload }) => {
        return {
            ...state,
            editing: null,
            paymentMethod: payload.code,
            paymentTitle: payload.title,
            step: 'form',
            submitting: false
        };
    },
    [actions.paymentMethod.reject]: state => {
        return {
            ...state,
            submitting: false
        };
    },
    [actions.shippingMethod.submit]: state => {
        return {
            ...state,
            submitting: true
        };
    },
    [actions.shippingMethod.accept]: (state, { payload }) => {
        return {
            ...state,
            editing: null,
            shippingMethod: payload.carrier_code,
            shippingTitle: payload.carrier_title,
            step: 'form',
            submitting: false
        };
    },
    [actions.shippingMethod.reject]: state => {
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
    [actions.reset]: () => initialState
};

export default handleActions(reducerMap, initialState);
