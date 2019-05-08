import { useCallback } from 'react';
import { useToastDispatch } from './context';

const DEFAULT_TIMEOUT = 5000;

export const useToastActions = () => {
    const dispatch = useToastDispatch();

    const addToast = useCallback(
        ({ type, message, dismissable, icon, actionText, actionCallback }) => {
            const id = Date.now();

            // Queue to delete the toast after some time.
            if (!dismissable) {
                setTimeout(() => {
                    removeToast(id);
                }, DEFAULT_TIMEOUT);
            }

            return dispatch({
                type: 'add',
                payload: {
                    id,
                    type,
                    message,
                    icon,
                    actionText,
                    actionCallback,
                    dismissable
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
