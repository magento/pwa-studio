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

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that contain
 * logic for handling a query result.
 *
 * This is the main entry point for this module.
 *
 * @kind function
 *
 * @return {object[]} An array with two entries: [ {@link State}, {@link Api}]
 */
export const useQueryResult = () => {
    /**
     * A function for dispatching actions specific to this module.
     * This is similar to the [dispatch() function in Redux]{@link https://redux.js.org/api/store#dispatch}
     *
     * @function Api.dispatch
     *
     * @param {State} state The current state
     * @param {Action} action An Action object
     */
    const [state, dispatch] = useReducer(reducer, initialState);

    /**
     * Set the state data
     *
     * @function Api.setData
     *
     * @param {object} data The updated state data
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
     * Set the error state
     *
     * @function Api.setError
     *
     * @param {object} errorData The error data for the state
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
     * Set the loading state
     *
     * @function Api.setLoading
     *
     * @param {bool} isLoading New value for the loading state
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
     * Updates the state using the response payload.
     *
     * @function Api.receiveResponse
     *
     * @param {object} payload The query response payload
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
     * Resets the state to its initial value.
     *
     * @function Api.resetState
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
     * The API for this module.
     * This object should never change.
     * @typedef Api
     * @type object
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

// Misc. type definitions

/**
 * The current state of a query result.
 *
 * @typedef State
 * @type object
 *
 * @property {object} data The query data or null if it is not available.
 * @property {object} error Error object that is set when there is an error getting the query.
 * @property {bool} loading True if the query is still being loaded. False otherwise.
 */

/**
 * An Action object similar to a [Redux Action]{@link https://redux.js.org/basics/actions}.
 *
 * @typedef Action
 * @type object
 *
 * @property {object} payload The data payload for an action
 * @property {string} type The type of action associated with this object
 */
