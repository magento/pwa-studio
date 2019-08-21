import React, { createContext, useContext, useReducer } from 'react';
import withLogger from '../util/withLogger';
/**
 * The state of the toast store.
 * @typedef {Object} ToastState
 * @property {Map} toasts - map of id => toast
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
 * A context provider that provides the toast state object and the dispatch
 * function.
 *
 * @example
 *   <ToastContextProvider>
 *     <ToastContainer /> // A component which would display based on state.
 *     <AddToastComponent /> // A component which adds a toast using actions.
 *   </ToastContextProvider>
 */
export const ToastContextProvider = ({ children }) => {
    const store = useReducer(wrappedReducer, initialState);
    return (
        <ToastContext.Provider value={store}>{children}</ToastContext.Provider>
    );
};

/**
 * A hook that provides access to the toast state and dispatch.
 * !Any component using this hook _must_ be a child of a `ToastContextProvider`.
 *
 * @return {[ToastState, Function]} The toast context value.
 * @example
 *   const [toastState, dispatch] = useToastState();
 */
export const useToastContext = () => useContext(ToastContext);
