import { useCallback, useMemo, useReducer } from 'react';

import { BrowserPersistence } from '../../util';

const storage = new BrowserPersistence();

const initialState = {
    availableShippingMethods: [],
    billingAddress: null,
    // editing: null, TODO: Migrate this state to UI
    // paymentCode: '', // TODO: Potentially delete if unused.
    paymentData: null,
    shippingAddress: null,
    shippingMethod: '',
    shippingTitle: '',
    // step: 'cart', TODO: Migrate this state to UI
    // submitting: false, TODO: Migrate this state to UI
    isAddressInvalid: false,
    invalidAddressMessage: ''
};

const reducer = (state, { payload, type }) => {
    switch (type) {
        case 'begin checkout': {
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
        case 'set invalid address error message': {
            const invalidAddressMessage = get(
                payload, // TODO: verify this works.
                'payload.invalidAddressMessage',
                ''
            );

            return {
                ...state,
                isAddressInvalid: invalidAddressMessage ? true : false,
                invalidAddressMessage
            };
        }
        case 'set payment method': {
            return {
                ...state,
                paymentCode: payload.code,
                paymentData: payload.data,
                step: 'form'
            };
        }
        case 'set shipping address': {
            return {
                ...state,
                shippingAddress: {
                    ...state.shippingAddress,
                    ...payload,
                    street: [...payload.street]
                },
                isAddressInvalid: false,
                invalidAddressMessage: ''
            };
        }
        case 'set shipping method': {
            return {
                ...state,
                shippingMethod: payload.carrier_code,
                shippingTitle: payload.carrier_title,
                isAddressInvalid: false,
                invalidAddressMessage: ''
            };
        }
        default: {
            return state;
        }
    }
};

export const useCheckoutState = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

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
            dispatch({
                payload,
                type: 'set billing address'
            });
        },
        [dispatch]
    );

    const setInvalidAddressErrorMessage = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set invalid address error message'
            });
        },
        [dispatch]
    );

    const setPaymentMethod = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set payment method'
            });
        },
        [dispatch]
    );

    const setShippingAddress = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set shipping address'
            });
        },
        [dispatch]
    );

    const setShippingMethod = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set shipping method'
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
            setInvalidAddressErrorMessage,
            setPaymentMethod,
            setShippingAddress,
            setShippingMethod
        }),
        [
            beginCheckout,
            reset,
            setAvailableShippingMethods,
            setBillingAddress,
            setInvalidAddressErrorMessage,
            setPaymentMethod,
            setShippingAddress,
            setShippingMethod
        ]
    );

    return [state, api];
};
