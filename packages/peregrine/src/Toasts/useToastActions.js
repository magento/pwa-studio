import { useCallback } from 'react';
import { useToastDispatch } from './context';

export const useToastActions = () => {
    const dispatch = useToastDispatch();

    const addToast = useCallback(
        (type, message, dismissable, icon, actionText, actionCallback) => {
            const id = Date.now();

            // Queue to delete the toast after some time.
            if (!dismissable) {
                setTimeout(() => {
                    removeToast(id);
                }, 5000);
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
