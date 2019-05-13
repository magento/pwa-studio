import { useCallback } from 'react';
import { useToastDispatch } from './context';

// If a toast _is not_ dismissable remove it in this many milliseconds.
const DEFAULT_TIMEOUT = 5000;

/**
 * Generates an identifier for a toast in a pure manner. Should always return
 * the same identifier for a given set of props.
 */
const getToastId = props => {
    const combined = Object.keys(props).reduce(
        (acc, curr) => acc + props[curr]
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

export const useToastActions = () => {
    const dispatch = useToastDispatch();

    const addToast = useCallback(
        toastProps => {
            const { timeout } = toastProps;
            // Duplicate toasts should extend the timeout so let's generate the
            // id by looking at the props that would indicate a duplicate.
            const id = getToastId(toastProps);

            // Queue to delete the toast after some time.
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
                    removalTimeoutId,
                    timestamp: Date.now()
                }
            });

            return id;
        },
        [dispatch]
    );

    const removeToast = useCallback(
        id =>
            dispatch({
                type: 'remove',
                payload: { id }
            }),
        [dispatch]
    );

    return { addToast, removeToast };
};
