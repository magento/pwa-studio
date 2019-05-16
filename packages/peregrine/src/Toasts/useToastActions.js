import { useCallback } from 'react';
import { useToastDispatch } from './useToastContext';

// If a toast _is not_ dismissable remove it in this many milliseconds.
const DEFAULT_TIMEOUT = 5000;

/**
 * Generates an identifier for a toast in a pure manner. Should always return
 * the same identifier for a given set of props.
 */
const getToastId = props => {
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
 * A hook that provides access to the `addToast` and `removeToast` actions.
 * !Any component using this hook _must_ be a child of a `ToastContextProvider`.
 *
 * @returns {ToastActions} Object containing addToast and removeToast functions
 */
export const useToastActions = () => {
    const dispatch = useToastDispatch();

    /**
     * Dispatches a add action. Includes all props passed along with a hash id
     * and a timeout id generated based on the incoming props.
     *
     * @function addToast
     * @param {Object}   toastProps - The object containing props for adding a toast.
     * @param {string}   toastProps.type - 'info', 'warning' or 'error'.
     * @param {string}   toastProps.message - The message to display in the toast.
     * @param {boolean}  toastProps.dismissable - Should the toast be closeable by user?
     * @param {Icon}     [toastProps.icon] - The Icon component to display in the toast.
     * @param {function} [toastProps.onDismiss] - callback invoked after dismiss.
     * @param {string}   [toastProps.actionText] - Text to display as a call to action.
     * @param {function} [toastProps.onAction] - callback invoked after action text click.
     *
     * @returns {Number} id - the key referencing the toast in the store
     */
    const addToast = useCallback(
        toastProps => {
            const { timeout } = toastProps;
            // Generate the id to use in the removal timeout.
            const id = getToastId(toastProps);

            // Queue to delete the toast by id after some time.
            const removalTimeoutId = setTimeout(
                () => {
                    removeToast(id);
                },
                timeout ? timeout : DEFAULT_TIMEOUT
            );

            dispatch({
                type: 'add',
                payload: {
                    ...toastProps,
                    id,
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
        id =>
            dispatch({
                type: 'remove',
                payload: { id }
            }),
        [dispatch]
    );

    /**
     * @typedef ToastActions
     * @property {addToast} addToast
     * @property {removeToast} removeToast
     */
    const ToastActions = {
        addToast,
        removeToast
    };

    return ToastActions;
};
