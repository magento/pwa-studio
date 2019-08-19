import { useCallback, useMemo, useReducer } from 'react';
import withLogger from '../../util/withLogger';

const initialState = {
    cartId: null,
    details: {},
    paymentMethods: [],
    totals: {}
};

const reducer = (state, { payload, type }) => {
    switch (type) {
        case 'reset cart': {
            return {
                ...initialState
            };
        }
        case 'set cart id': {
            return {
                ...state,
                cartId: payload
            };
        }
        case 'set details': {
            return {
                ...state,
                details: {
                    ...payload
                }
            };
        }
        case 'set payment methods': {
            return {
                ...state,
                paymentMethods: [...payload]
            };
        }
        case 'set totals': {
            return {
                ...state,
                totals: {
                    ...payload
                }
            };
        }
        default: {
            return state;
        }
    }
};

const wrappedReducer = withLogger(reducer);
export const useCartState = () => {
    const [state, dispatch] = useReducer(wrappedReducer, initialState);

    const resetCart = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'reset cart'
            });
        },
        [dispatch]
    );

    const setCartId = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set cart id'
            });
        },
        [dispatch]
    );
    const setDetails = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set details'
            });
        },
        [dispatch]
    );
    const setPaymentMethods = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set payment methods'
            });
        },
        [dispatch]
    );
    const setTotals = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set totals'
            });
        },
        [dispatch]
    );
    const api = useMemo(
        () => ({
            dispatch,
            resetCart,
            setCartId,
            setDetails,
            setPaymentMethods,
            setTotals
        }),
        [
            resetCart,
            setCartId,
            setDetails,
            setPaymentMethods,
            setTotals,
            dispatch
        ]
    );

    return [state, api];
};
