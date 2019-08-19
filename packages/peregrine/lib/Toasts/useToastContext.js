import React, { createContext, useContext, useReducer } from 'react';
import withLogger from '../util/withLogger';

/**
 * The current state of the toast store.
 *
 * @typedef {Object} ToastState
 *
 * @property {Map} toasts Map object associating an id to toast data
 */
const initialState = {
    toasts: new Map()
};

const reducer = (prevState = initialState, action = {}) => {
    const { type, payload } = action;

    switch (type) {
        case 'add': {
            const nextToasts = new Map(prevState.toasts);
            const prevToast = nextToasts.get(payload.id);

            const isDuplicate = !!prevToast;
            let timestamp = payload.timestamp;
            if (isDuplicate) {
                // If this is a _new_ duplicate toast we need to clear the
                // previous timeout to prevent premature removal.
                window.clearTimeout(prevToast.removalTimeoutId);

                // And to retain chronological order of addition, keep the
                // original timestamp.
                timestamp = prevToast.timestamp;
            }

            nextToasts.set(payload.id, {
                ...payload,
                timestamp,
                isDuplicate
            });

            return {
                ...prevState,
                toasts: nextToasts
            };
        }
        case 'remove': {
            const nextToasts = new Map(prevState.toasts);

            const prevToast = nextToasts.get(payload.id);
            if (prevToast) {
                window.clearTimeout(prevToast.removalTimeoutId);
            }

            nextToasts.delete(payload.id);

            return {
                ...prevState,
                toasts: nextToasts
            };
        }
        default:
            return prevState;
    }
};

const ToastContext = createContext();

const wrappedReducer = withLogger(reducer);

/**
 * A [context]{@link https://reactjs.org/docs/context.html} provider that
 * provides the toast state object and a dispatch function to toast
 * functionality consumers.
 *
 * @typedef ToastContextProvider
 *
 */
export const ToastContextProvider = ({ children }) => {
    const store = useReducer(wrappedReducer, initialState);
    return (
        <ToastContext.Provider value={store}>{children}</ToastContext.Provider>
    );
};

/**
 * A hook that provides access to the toast state and dispatch.
 * Any component using this hook _must_ be a child of a {@link ToastContextProvider}.
 *
 * @typedef useToastContext
 *
 * @return {Object[]} An array containing the state and dispatch function: [{@link ToastState}, function]
 *
 * @example
 *   const [toastState, dispatch] = useToastState();
 */
export const useToastContext = () => useContext(ToastContext);
