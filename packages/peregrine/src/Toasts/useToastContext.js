import React, { createContext, useContext, useReducer } from 'react';
/**
 * The state of the toast store.
 * @typedef {Object} ToastState
 * @property {Object} toasts - unordered map of id:toast
 */
const initialState = {
    toasts: {}
};

const reducer = (prevState = initialState, action = {}) => {
    const { type, payload } = action;

    if (!type) {
        throw new TypeError('action.type is required');
    }

    if (!payload.id) {
        throw new TypeError('action.payload.id is required');
    }

    switch (type) {
        case 'add': {
            // If we are adding a toast that already exists we need to clear the
            // old removal timeout effectively resetting the delete timer.
            if (prevState.toasts[payload.id]) {
                window.clearTimeout(
                    prevState.toasts[payload.id].removalTimeoutId
                );
            }

            const duplicate = !!prevState.toasts[payload.id];

            // For duplicate toasts, do not update the timestamp to maintain
            // order of toast emission.
            const timestamp = duplicate
                ? prevState.toasts[payload.id].timestamp
                : Date.now();

            // Use a random key to trigger a recreation of this component if it
            // is a duplicate so that we can re-trigger the blink animation.
            const key = duplicate ? Math.random() : payload.id;

            const newState = {
                ...prevState,
                toasts: {
                    ...prevState.toasts,
                    [payload.id]: {
                        ...payload,
                        timestamp,
                        duplicate,
                        key
                    }
                }
            };

            return newState;
        }
        case 'remove': {
            const newState = {
                ...prevState
            };

            // It is possible to attempt to delete a non-existant toast so let's
            // gracefully handle that.
            if (newState.toasts[payload.id]) {
                // Clear the old toast removal timeout incase an identical toast
                // is added after this.
                window.clearTimeout(
                    newState.toasts[payload.id].removalTimeoutId
                );

                // Delete the toast from the store.
                delete newState.toasts[payload.id];
            }

            // Do not blink on removal.
            Object.keys(newState.toasts).forEach(key => {
                newState.toasts[key].duplicate = false;
            });

            return newState;
        }
        default:
            return prevState;
    }
};

const ToastContext = createContext();

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
    return (
        <ToastContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </ToastContext.Provider>
    );
};

/**
 * A hook that provides access to the toast state object.
 * !Any component using this hook _must_ be a child of a `ToastContextProvider`.
 *
 * @return {ToastState} The toast state object.
 * @example
 *   const toastState = useToastState();
 */
export const useToastState = () => useContext(ToastContext)[0];

/**
 * A hook that provides access to the toast dispatch function.
 * !Any component using this hook _must_ be a child of a `ToastContextProvider`.
 *
 * @return {Function} The action dispatch function.
 * @example
 *   const dispatch = useToastDispatch();
 */
export const useToastDispatch = () => useContext(ToastContext)[1];
