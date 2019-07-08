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
        case 'receive error': {
            return {
                data: null,
                error: payload,
                loading: false
            };
        }
        case 'receive response': {
            return {
                data: payload,
                error: null,
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

/**
 * Exposes the current state of the REST response
 * as well as an API for updating that state.
 */
export const useRestResponse = () => {
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

    const receiveError = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'receive error'
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

    // This object should never change.
    const api = useMemo(
        () => ({
            dispatch,
            receiveError,
            receiveResponse,
            resetState,
            setData,
            setError,
            setLoading
        }),
        [
            dispatch,
            receiveError,
            receiveResponse,
            resetState,
            setData,
            setError,
            setLoading
        ]
    );

    return [state, api];
};
