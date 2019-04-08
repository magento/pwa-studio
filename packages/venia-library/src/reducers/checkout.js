import { handleActions } from 'redux-actions';
import get from 'lodash/get';
import { Util } from '@magento/peregrine';
import actions from 'src/actions/checkout';

const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const name = 'checkout';

const initialState = {
    availableShippingMethods: [],
    billingAddress: null,
    editing: null,
    paymentCode: '',
    paymentData: null,
    shippingAddress: null,
    shippingMethod: '',
    shippingTitle: '',
    step: 'cart',
    submitting: false,
    isAddressIncorrect: false,
    incorrectAddressMessage: ''
};

const reducerMap = {
    [actions.begin]: state => {
        const storedBillingAddress = storage.getItem('billing_address');
        const storedPaymentMethod = storage.getItem('paymentMethod');
        const storedShippingAddress = storage.getItem('shipping_address');
        const storedShippingMethod = storage.getItem('shippingMethod');

        return {
            ...state,
            billingAddress: storedBillingAddress,
            paymentCode: storedPaymentMethod && storedPaymentMethod.code,
            paymentData: storedPaymentMethod && storedPaymentMethod.data,
            shippingAddress: storedShippingAddress,
            shippingMethod:
                storedShippingMethod && storedShippingMethod.carrier_code,
            shippingTitle:
                storedShippingMethod && storedShippingMethod.carrier_title,
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
    [actions.billingAddress.submit]: state => state,
    [actions.billingAddress.accept]: (state, { payload }) => {
        return {
            ...state,
            billingAddress: payload
        };
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
    [actions.shippingAddress.submit]: state => {
        return {
            ...state,
            submitting: true
        };
    },
    [actions.shippingAddress.accept]: (state, { payload }) => {
        return {
            ...state,
            editing: null,
            shippingAddress: payload,
            step: 'form',
            submitting: false,
            isAddressIncorrect: false,
            incorrectAddressMessage: ''
        };
    },
    [actions.shippingAddress.reject]: (state, actionArgs) => {
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
            paymentCode: payload.code,
            paymentData: payload.data,
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
