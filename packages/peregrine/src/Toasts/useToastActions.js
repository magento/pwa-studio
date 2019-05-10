import { useCallback } from 'react';
import { useToastDispatch } from './context';

// If a toast _is not_ dismissable remove it in this many milliseconds.
const DEFAULT_TIMEOUT = 5000;

export const useToastActions = () => {
    const dispatch = useToastDispatch();

    const addToast = useCallback(
        toastProps => {
            const id = Date.now();
            const { timeout } = toastProps;

            // Queue to delete the toast after some time.
            setTimeout(() => {
                removeToast(id);
            }, timeout ? timeout : DEFAULT_TIMEOUT);

            return dispatch({
                type: 'add',
                payload: {
                    ...toastProps,
                    id
                }
            });
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
