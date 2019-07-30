import { useCallback, useMemo, useReducer } from 'react';

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
        default: {
            return state;
        }
    }
};

export const useCartState = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const api = useMemo(
        () => ({
            dispatch
        }),
        [dispatch]
    );

    return [state, api];
};
