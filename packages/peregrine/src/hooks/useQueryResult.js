import { useCallback, useMemo, useReducer } from 'react';

/**
 * An object containing state.
 * @typedef {object} QueryState
 * @prop {any | null} data
 * @prop {any | null} error
 * @prop {boolean} loading
 */

/**
 * @type {QueryState}
 */
const initialState = {
    data: null,
    error: null,
    loading: false
};

/**
 * An object describing a state change.
 * @typedef {object} Action
 * @prop {any} payload
 * @prop {"receive response" | "reset state" | "set data" | "set error" | "set loading"} type
 */

/**
 * A reducing function that returns new state objects.
 * @callback QueryReducer
 * @param {QueryState} state
 * @param {Action} action
 * @returns {QueryState}
 */

/**
 * @type {QueryReducer}
 */
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

    /**
     * @callback BoundActionCreator
     * @param {any} payload
     * @returns {void}
     */

    /**
     * @type {BoundActionCreator}
     */
    const setData = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set data'
            });
        },
        [dispatch]
    );

    /**
     * @type {BoundActionCreator}
     */
    const setError = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set error'
            });
        },
        [dispatch]
    );

    /**
     * @type {BoundActionCreator}
     */
    const setLoading = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set loading'
            });
        },
        [dispatch]
    );

    /**
     * @type {BoundActionCreator}
     */
    const receiveResponse = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'receive response'
            });
        },
        [dispatch]
    );

    /**
     * @type {BoundActionCreator}
     */
    const resetState = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'reset state'
            });
        },
        [dispatch]
    );

    /**
     * @typedef {object} QueryApi
     * @prop {typeof dispatch} dispatch
     * @prop {typeof receiveResponse} receiveResponse
     * @prop {BoundActionCreator} resetState
     * @prop {BoundActionCreator} setData
     * @prop {BoundActionCreator} setError
     * @prop {BoundActionCreator} setLoading
     */
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
