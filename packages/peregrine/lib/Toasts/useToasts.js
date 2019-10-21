import { useCallback, useMemo } from 'react';
import { useToastContext } from './useToastContext';

// By default all toasts are dismissed after a timeout unless specified by the
// implementer via `timeout = 0` or `timeout = false`.
const DEFAULT_TIMEOUT = 5000;

/**
 * Generates an identifier for a toast by inspecting the properties that
 * differentiate toasts from one another.
 *
 * @typedef getToastId
 * @kind function
 *
 * @param {Object} properties A composite identifier object with properties
 *   that identify a specific toast using its {@link ToastProps}.
 * @param {String} properties.type Maps to the `type` property of {@link ToastProps}
 * @param {String} properties.message Maps to the `message` property of {@link ToastProps}
 * @param {Boolean} properties.dismissable=true Maps to the `dismissable` property of {@link ToastProps}
 * @param {String} properties.actionText='' Maps to the `actionText` property of {@link ToastProps}
 * @param {React.Element} properties.icon=()=>{} Maps to the `icon` property of {@link ToastProps}
 *
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
    let hash = 0;
    let i;
    let chr;
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
 * @kind function
 *
 * @returns {Object[]} An array containing objects for the toast state and its API: [{@link ../useToastContext#ToastState ToastState}, {@link API}]
 */
export const useToasts = () => {
    const [state, dispatch] = useToastContext();

    /**
     * Removes a toast from the toast store.
     *
     * @function API.removeToast
     *
     * @param {Number} id The id of the toast to remove
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
     * Dispatches an add action. Includes all props passed along with a hash id
     * and a timeout id generated based on the incoming props.
     *
     * @function API.addToast
     *
     * @param {ToastProps} toastProps The object containing props for adding a toast.
     *
     * @returns {Number} id The key referencing the toast in the store
     */
    const addToast = useCallback(
        /**
         * Object containing data for creating toasts using {@link API.addToast}.
         *
         * @typedef ToastProps
         *
         * @property {String} type One of the following toast types: 'info', 'warning',
         *   or 'error'
         * @property {String} message The message to display on the toast
         * @property {Bool} [dismissable] Indicates whether the toast is dismissable.
         *   If `onDismiss` is provided, this property is assumed to be true.
         *   This property is optional when creating toasts.
         * @property {React.Element} [icon] The icon element to display.
         *   This property is optional when creating toasts.
         * @property {Function} [onDismiss] Callback invoked when a user clicks the
         *   dismiss icon.
         *   This property is optional when creating toasts.
         * @property {String} [actionText] Text to display as a call to action.
         *   This property is optional when creating toasts.
         * @property {Function} [onAction] Callback invoked when a user clicks the action
         *   text.
         *   This property is optional when creating toasts.
         * @property {Number} [timeout] Time, in ms, before the toast is automatically
         *   dismissed.
         *   If `0` or `false` is passed, the toast will not timeout.
         *   This property is optional when creating toasts.
         *
         */
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
     * The API for managing toasts.
     * Use this API to add and remove toasts.
     *
     * @typedef API
     * @type Object
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
