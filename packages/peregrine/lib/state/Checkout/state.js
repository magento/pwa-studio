import { useCallback, useMemo, useReducer } from 'react';
import withLogger from '../../util/withLogger';

import { BrowserPersistence } from '../../util';

const storage = new BrowserPersistence();

const initialState = {
    availableShippingMethods: [],
    billingAddress: {},
    paymentCode: '',
    paymentData: null,
    shippingAddress: {},
    shippingMethod: {},
    shippingTitle: ''
};

const reducer = (state, { payload, type }) => {
    switch (type) {
        case 'begin checkout': {
            // TODO: move to action
            const storedBillingAddress = storage.getItem('billing_address');
            const storedPaymentMethod = storage.getItem('paymentMethod');
            const storedShippingAddress = storage.getItem('shipping_address');
            const storedShippingMethod = storage.getItem('shippingMethod');

            return {
                ...state,
                billingAddress:
                    storedBillingAddress || initialState.billingAddress,
                paymentCode: storedPaymentMethod && storedPaymentMethod.code,
                paymentData: storedPaymentMethod && storedPaymentMethod.data,
                shippingAddress:
                    storedShippingAddress || initialState.shippingAddress,
                shippingMethod: storedShippingMethod,
                shippingTitle:
                    storedShippingMethod && storedShippingMethod.carrier_title
            };
        }
        case 'reset': {
            return { ...initialState };
        }
        case 'set available shipping methods': {
            return {
                ...state,
                availableShippingMethods: payload.map(method => ({
                    ...method,
                    code: method.carrier_code,
                    title: method.carrier_title
                }))
            };
        }
        case 'set billing address': {
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
        }
        case 'set payment method': {
            return {
                ...state,
                paymentCode: payload.code,
                paymentData: payload.data
            };
        }
        case 'set shipping address': {
            return {
                ...state,
                shippingAddress: {
                    ...state.shippingAddress,
                    ...payload,
                    street: [...payload.street]
                }
            };
        }
        case 'set shipping method': {
            return {
                ...state,
                shippingMethod: payload.carrier_code,
                shippingTitle: payload.carrier_title
            };
        }
        default: {
            return state;
        }
    }
};

const wrappedReducer = withLogger(reducer);
export const useCheckoutState = () => {
    const [state, dispatch] = useReducer(wrappedReducer, initialState);

    const beginCheckout = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'begin checkout'
            });
        },
        [dispatch]
    );

    const reset = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'reset'
            });
        },
        [dispatch]
    );

    const setAvailableShippingMethods = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set available shipping methods'
            });
        },
        [dispatch]
    );

    const setBillingAddress = useCallback(
        payload => {
            storage.setItem('billing_address', payload);
            dispatch({
                payload,
                type: 'set billing address'
            });
        },
        [dispatch]
    );

    const setPaymentMethod = useCallback(
        payload => {
            storage.setItem('paymentMethod', payload);
            dispatch({
                payload,
                type: 'set payment method'
            });
        },
        [dispatch]
    );

    const setShippingAddress = useCallback(
        payload => {
            storage.setItem('shipping_address', payload);
            dispatch({
                payload,
                type: 'set shipping address'
            });
        },
        [dispatch]
    );

    const setShippingMethod = useCallback(
        payload => {
            storage.setItem('shippingMethod', payload);
            dispatch({
                payload,
                type: 'set shipping method'
            });
        },
        [dispatch]
    );

    const submitOrder = useCallback(
        payload => {
            storage.removeItem('shipping_address');
            storage.removeItem('billing_address');
            storage.removeItem('cartId');
            storage.removeItem('paymentMethod');
            storage.removeItem('shippingMethod');
            dispatch({
                payload,
                type: 'submit order'
            });
        },
        [dispatch]
    );

    const api = useMemo(
        () => ({
            beginCheckout,
            reset,
            setAvailableShippingMethods,
            setBillingAddress,
            setPaymentMethod,
            setShippingAddress,
            setShippingMethod,
            submitOrder
        }),
        [
            beginCheckout,
            reset,
            setAvailableShippingMethods,
            setBillingAddress,
            setPaymentMethod,
            setShippingAddress,
            setShippingMethod,
            submitOrder
        ]
    );

    return [state, api];
};
