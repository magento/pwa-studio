import { useCallback, useMemo, useReducer } from 'react';

const initialState = {
    data: null,
    error: null,
    loading: false
};

const reducer = (state, { payload, type }) => {
    switch (type) {
        case 'set data': {
            return { ...state, data: payload };
        }
        case 'set error': {
            return { ...state, error: payload };
        }
        case 'set loading': {
            return { ...state, loading: payload };
        }
        case 'receive response': {
            const { data, error } = payload;

            return {
                data: data || null,
                error: error || null,
                loading: false
            };
        }
        case 'reset state': {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export const useQueryResult = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const setData = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set data'
            });
        },
        [dispatch]
    );

    const setError = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set error'
            });
        },
        [dispatch]
    );

    const setLoading = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set loading'
            });
        },
        [dispatch]
    );

    const receiveResponse = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'receive response'
            });
        },
        [dispatch]
    );

    const resetState = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'reset state'
            });
        },
        [dispatch]
    );

    // this object should never change
    const api = useMemo(
        () => ({
            dispatch,
            receiveResponse,
            resetState,
            setData,
            setError,
            setLoading
        }),
        [dispatch, receiveResponse, resetState, setData, setError, setLoading]
    );

    return [state, api];
};
