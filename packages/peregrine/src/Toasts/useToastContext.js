import React, { createContext, useContext, useReducer } from 'react';
/**
 * The state of the toast store.
 * @typedef {Object} ToastState
 * @property {Object} toasts - unordered map of id:toast
 */
const initialState = {
    toasts: new Map()
};

const reducer = (prevState = initialState, action = {}) => {
    const { type, payload } = action;

    switch (type) {
        case 'add': {
            const nextToasts = new Map(prevState.toasts);
            nextToasts.set(payload.id, payload);

            return {
                ...prevState,
                toasts: nextToasts
            };
        }
        case 'remove': {
            const nextToasts = new Map(prevState.toasts);

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
    const store = useReducer(reducer, initialState);
    return (
        <ToastContext.Provider value={store}>{children}</ToastContext.Provider>
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
