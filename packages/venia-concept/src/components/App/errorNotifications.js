import { useCallback, useEffect } from 'react';
import { arrayOf, object, func, shape, string } from 'prop-types';
import AlertCircleIcon from 'react-feather/dist/icons/alert-circle';
import { useToastActions } from '@magento/peregrine/src/Toasts/useToastActions';

const dismissers = new WeakMap();

const ErrorNotifications = props => {
    const { onDismissError } = props;
    const { addToast } = useToastActions();

    // Memoize dismisser funcs to reduce re-renders from func identity change.
    const getErrorDismisser = useCallback(
        error => {
            return dismissers.has(error)
                ? dismissers.get(error)
                : dismissers.set(error, () => onDismissError(error)).get(error);
        },
        [onDismissError]
    );

    return props.errors.map(({ error, id, loc }) => {
        useEffect(() => {
            // TODO: Without the enclosing useEffect this endless loops. Why?
            addToast({
                type: 'error',
                message: `Sorry! An unexpected error occurred.\nDebug: ${id} ${loc}`,
                icon: AlertCircleIcon,
                dismissable: true,
                timeout: 7000,
                onDismiss: getErrorDismisser(error)
            });
        }, [error, id, loc]);

        return null;
    });
};

ErrorNotifications.propTypes = {
    errors: arrayOf(
        shape({
            error: object.isRequired,
            id: string.isRequired,
            loc: string
        })
    ),
    onDismissError: func.isRequired
};

export default ErrorNotifications;
