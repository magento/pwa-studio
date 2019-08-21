import { useCallback, useMemo, useReducer } from 'react';
import * as actions from './actions';
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
    const { cartId } = state;

    const createCart = useCallback(
        async isSignedIn => {
            if (cartId) {
                return cartId;
            } else {
                console.log('No cart found. Creating new cart.');
                const id = await actions.createCart(isSignedIn);
                dispatch({
                    payload: id,
                    type: 'set cart id'
                });
                return id;
            }
        },
        [cartId]
    );

    const addItem = useCallback(
        async (item, isSignedIn) => {
            // Create cart if it doesn't exist
            const cartId = await createCart(isSignedIn);
            // add item to cart
            await actions.addItemToCart(item, cartId, isSignedIn);
            // update details
            // const details = await actions.getCartDetails();
            // dispatch({
            //     details,
            //     type: 'set details'
            // })
        },
        [createCart]
    );

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
            addItem,
            createCart,
            dispatch,
            resetCart,
            setCartId,
            setDetails,
            setPaymentMethods,
            setTotals
        }),
        [
            addItem,
            createCart,
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
