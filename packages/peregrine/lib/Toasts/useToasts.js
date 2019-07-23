import { useCallback, useMemo } from 'react';
import { useToastContext } from './useToastContext';

// By default all toasts are dismissed after a timeout unless specified by the
// implementer via `timeout = 0` or `timeout = false`.
const DEFAULT_TIMEOUT = 5000;

/**
 * Generates an identifier for a toast by inspecting the properties that would
 * differentiate the toasts visually from one another.
 */
export const getToastId = ({
    type,
    message,
    dismissable = true,
    actionText = '',
    icon = () => {}
}) => {
    const combined = [type, message, dismissable, actionText, icon].join();

    // The hashing function below should generally avoid accidental collisions.
    // It exists to give a "readable" identifier to toasts for debugging.
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
    const [state, dispatch] = useToastContext();

    /**
     * Removes a toast from the toast store.
     * @function removeToast
     * @params {Number} id - the id of the toast to remove
     */
    const removeToast = useCallback(
        id => {
            dispatch({
                type: 'remove',
                payload: { id }
            });
        },
        [dispatch]
    );

    /**
     * Dispatches a add action. Includes all props passed along with a hash id
     * and a timeout id generated based on the incoming props.
     *
     * !Note
     * If an `onAction` or `onDismiss` callback is provided the implementer MUST
     * call the passed `remove` function. If no `onDismiss` callback is
     * provided the toast will be removed immediately
     *
     * @example
     * addToast({
     *   type: 'error',
     *   message: 'An error occurred!',
     *   actionText: 'Retry',
     *   onAction: remove => {
     *     async attemptRetry();
     *     remove();
     *   },
     *   onDismiss: remove => {
     *     async doSomethingOnDismiss();
     *     remove();
     *   },
     *   icon: <Icon src={SadFaceIcon} />
     * });
     *
     * @function addToast
     * @param {Object}   toastProps - The object containing props for adding a toast.
     * @param {string}   toastProps.type - 'info', 'warning' or 'error'.
     * @param {string}   toastProps.message - The message to display in the toast.
     * @param {boolean}  [toastProps.dismissable] - Boolean indicating whether the toast is dismissable. If `onDismiss` is provided this is assumed to be true.
     * @param {React.Element} [toastProps.icon] - The icon element to display
     * @param {function} [toastProps.onDismiss] - Callback invoked when a user clicks the dismiss icon.
     * @param {string}   [toastProps.actionText] - Text to display as a call to action.
     * @param {function} [toastProps.onAction] - Callback invoked when a user clicks the action text.
     * @param {Number} [toastProps.timeout] - time, in ms, before the toast is automatically dismissed. If `0` or `false` is passed, the toast will not timeout.
     *
     * @returns {Number} id - the key referencing the toast in the store
     */
    const addToast = useCallback(
        toastProps => {
            const {
                dismissable,
                message,
                timeout,
                type,
                onDismiss,
                onAction
            } = toastProps;

            if (!type) {
                throw new TypeError('toast.type is required');
            }

            if (!message) {
                throw new TypeError('toast.message is required');
            }

            if (
                !(timeout || timeout === 0 || timeout === false) &&
                !(onDismiss || dismissable)
            ) {
                throw new TypeError(
                    'Toast should be user-dismissable or have a timeout'
                );
            }

            // Generate the id to use in the removal timeout.
            const id = getToastId(toastProps);

            const handleDismiss = () => {
                onDismiss ? onDismiss(() => removeToast(id)) : removeToast(id);
            };

            const handleAction = () =>
                onAction ? onAction(() => removeToast(id)) : () => {};

            // A timeout of 0 means no auto-dismiss.
            let removalTimeoutId;
            if (timeout !== 0 && timeout !== false) {
                removalTimeoutId = setTimeout(
                    () => {
                        handleDismiss();
                    },
                    timeout ? timeout : DEFAULT_TIMEOUT
                );
            }

            dispatch({
                type: 'add',
                payload: {
                    ...toastProps,
                    id,
                    timestamp: Date.now(),
                    removalTimeoutId,
                    handleDismiss,
                    handleAction
                }
            });

            return id;
        },
        [dispatch, removeToast]
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
