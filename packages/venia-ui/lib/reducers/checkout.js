import { handleActions } from 'redux-actions';
import get from 'lodash/get';
import { Util } from '@magento/peregrine';
import actions from '../actions/checkout';

const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const name = 'checkout';

const initialState = {
    availableShippingMethods: [],
    billingAddress: null,
    paymentCode: '',
    paymentData: null,
    shippingAddress: null,
    shippingMethod: '',
    shippingTitle: '',
    step: 'cart',
    submitting: false,
    isAddressInvalid: false,
    invalidAddressMessage: ''
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
            step: 'form'
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
    [actions.shippingAddress.submit]: state => {
        return {
            ...state,
            submitting: true
        };
    },
    [actions.shippingAddress.accept]: (state, { payload }) => {
        return {
            ...state,
            shippingAddress: {
                ...state.shippingAddress,
                ...payload,
                street: [...payload.street]
            },
            step: 'form',
            submitting: false,
            isAddressInvalid: false,
            invalidAddressMessage: ''
        };
    },
    [actions.shippingAddress.reject]: (state, actionArgs) => {
        const invalidAddressMessage = get(
            actionArgs,
            'payload.invalidAddressMessage',
            ''
        );

        return {
            ...state,
            submitting: false,
            isAddressInvalid: invalidAddressMessage ? true : false,
            invalidAddressMessage
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
            shippingMethod: payload.carrier_code,
            shippingTitle: payload.carrier_title,
            step: 'form',
            submitting: false,
            isAddressInvalid: false,
            invalidAddressMessage: ''
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
