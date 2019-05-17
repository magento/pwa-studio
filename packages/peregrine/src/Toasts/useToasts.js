import { useCallback, useMemo } from 'react';
import { useToastState, useToastDispatch } from './useToastContext';

// If a toast _is not_ dismissable remove it in this many milliseconds.
const DEFAULT_TIMEOUT = 5000;

/**
 * Generates an identifier for a toast in a pure manner. Should always return
 * the same identifier for a given set of props.
 */
export const getToastId = props => {
    const combined = Object.keys(props).reduce(
        (acc, curr) => acc + props[curr],
        ''
    );
    // The hashing function below should generally avoid accidental collisions.
    let hash = 0,
        i,
        chr;
    if (combined.length === 0) return hash;
    for (i = 0; i < combined.length; i++) {
        chr = combined.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

/**
 * A hook that provides access to the toast state and toast api.
 *
 * @returns {[ToastState, ToastApi]}
 */
export const useToasts = () => {
    const state = useToastState();
    const dispatch = useToastDispatch();

    const { toasts } = state;

    /**
     * Dispatches a add action. Includes all props passed along with a hash id
     * and a timeout id generated based on the incoming props.
     *
     * @function addToast
     * @param {Object}   toastProps - The object containing props for adding a toast.
     * @param {string}   toastProps.type - 'info', 'warning' or 'error'.
     * @param {string}   toastProps.message - The message to display in the toast.
     * @param {boolean}  [toastProps.dismissable] - Should the toast be closeable by user?
     * @param {Icon}     [toastProps.icon] - The Icon component to display in the toast.
     * @param {function} [toastProps.onDismiss] - callback invoked after dismiss.
     * @param {string}   [toastProps.actionText] - Text to display as a call to action.
     * @param {function} [toastProps.onAction] - callback invoked after action text click.
     *
     * @returns {Number} id - the key referencing the toast in the store
     */
    const addToast = useCallback(
        toastProps => {
            const { message, timeout, type } = toastProps;

            if (!type) {
                throw new TypeError('toast.type is required');
            }

            if (!message) {
                throw new TypeError('toast.message is required');
            }

            // Generate the id to use in the removal timeout.
            const id = getToastId(toastProps);

            // Queue to delete the toast by id after some time.
            const removalTimeoutId = setTimeout(
                () => {
                    // removeToast(id);
                },
                timeout ? timeout : DEFAULT_TIMEOUT
            );

            let timestamp;
            const isDuplicate = !!toasts[id];

            if (isDuplicate) {
                // For duplicate toasts, do not update the timestamp to maintain
                // order of toast emission.
                timestamp = toasts[id].timestamp;
                // Remove the previous toast timeout to prevent premature removal.
                window.clearTimeout(toasts[id].removalTimeoutId);
            } else {
                timestamp = Date.now();
            }

            dispatch({
                type: 'add',
                payload: {
                    ...toastProps,
                    id,
                    isDuplicate,
                    timestamp,
                    removalTimeoutId
                }
            });

            return id;
        },
        [dispatch]
    );

    /**
     * Removes a toast from the toast store.
     * @function removeToast
     * @params {Number} id - the id of the toast to remove
     */
    const removeToast = useCallback(
        id => {
            const { removalTimeoutId } = toasts[id];

            window.clearTimeout(removalTimeoutId);

            dispatch({
                type: 'remove',
                payload: { id }
            });
        },
        [dispatch]
    );

    /**
     * @typedef ToastApi
     * @property {addToast} addToast
     * @property {dispatch} dispatch
     * @property {removeToast} removeToast
     */
    const api = useMemo(
        () => ({
            addToast,
            dispatch,
            removeToast
        }),
        [addToast, dispatch, removeToast]
    );

    return [state, api];
};
