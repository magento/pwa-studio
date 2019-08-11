import { useCallback, useMemo, useReducer } from 'react';
import withLogger from '../util/withLogger';

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
const wrappedReducer = withLogger(reducer);

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that contains
 * logic for handling a query result.
 * It returns the state of the query result and an API object for managing that
 * state object.
 *
 * @typedef useQueryResult
 * @kind function
 *
 * @return {Object[]} An array with two entries containing the following content: [ {@link QueryResultState}, {@link API}]
 */
export const useQueryResult = () => {
    /**
     * A function for dispatching actions specific to this module.
     * This is similar to the [dispatch() function in Redux]{@link https://redux.js.org/api/store#dispatch}
     *
     * @function API.dispatch
     *
     * @param {QueryResultState} state The current state
     * @param {QueryResultAction} action A QueryResultAction object
     */
    const [state, dispatch] = useReducer(wrappedReducer, initialState);

    /**
     * Set the state data
     *
     * @function API.setData
     *
     * @param {Object} data The updated state data
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
     * @function API.setError
     *
     * @param {Object} errorData The error data for the state
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
     * @function API.setLoading
     *
     * @param {Boolean} isLoading New value for the loading state
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
     * @function API.receiveResponse
     *
     * @param {Object} payload The query response payload
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
     * @function API.resetState
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
     * The API for managing the query results state.
     * Use this API to update the various parts of the query result state.
     *
     * This object should never change.
     * @typedef API
     * @type Object
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
 * @typedef QueryResultState
 * @type Object
 *
 * @property {Object} data The query data or null if it is not available.
 * @property {Object} error Error object that is set when there is an error getting the query.
 * @property {Boolean} loading True if the query is still being loaded. False otherwise.
 */

/**
 * An Action object similar to a [Redux Action]{@link https://redux.js.org/basics/actions}.
 *
 * @typedef QueryResultAction
 * @type Object
 *
 * @property {Object} payload The data payload for an action
 * @property {String} type The type of action associated with this object
 */
