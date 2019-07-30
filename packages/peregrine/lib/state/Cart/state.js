import { useCallback, useMemo, useReducer } from 'react';
import withLogger from '../../util/withLogger';

const initialState = {
    cartId: null,
    details: {},
    editItem: null,
    paymentMethods: [],
    shippingMethods: [],
    totals: {}
};

const reducer = (state, { payload, type }) => {
    // TODO: add cases
    switch (type) {
        case 'set cart id': {
            return {
                ...state,
                cartId: payload
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

    const setCartId = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set cart id'
            });
        },
        [dispatch]
    );
    const api = useMemo(
        () => ({
            dispatch,
            setCartId
        }),
        [setCartId, dispatch]
    );

    return [state, api];
};
