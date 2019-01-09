import { handleActions } from 'redux-actions';
import get from 'lodash/get';
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
    step: 'cart',
    submitting: false,
    isAddressIncorrect: false,
    incorrectAddressMessage: ''
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
            editing: payload,
            incorrectAddressMessage: ''
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
            submitting: false,
            isAddressIncorrect: false,
            incorrectAddressMessage: ''
        };
    },
    [actions.address.reject]: (state, actionArgs) => {
        const incorrectAddressMessage = get(
            actionArgs,
            'payload.incorrectAddressMessage',
            ''
        );

        return {
            ...state,
            submitting: false,
            isAddressIncorrect: incorrectAddressMessage ? true : false,
            incorrectAddressMessage
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
            submitting: false,
            isAddressIncorrect: false,
            incorrectAddressMessage: ''
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
