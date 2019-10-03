import { useCallback, useEffect, useMemo } from 'react';
import errorRecord from '@magento/peregrine/lib/util/createErrorRecord';
import { useAppContext } from '@magento/peregrine/lib/context/app';

const dismissers = new WeakMap();

// Memoize dismisser funcs to reduce re-renders from func identity change.
const getErrorDismisser = (error, onDismissError) => {
    return dismissers.has(error)
        ? dismissers.get(error)
        : dismissers.set(error, () => onDismissError(error)).get(error);
};

export const useApp = props => {
    const [appState, appApi] = useAppContext();
    const {
        handleError,
        handleIsOffline,
        handleIsOnline,
        markErrorHandled,
        renderError,
        unhandledErrors
    } = props;

    const reload = useCallback(
        process.env.NODE_ENV === 'development'
            ? () => {
                  console.log(
                      'Default window.location.reload() error handler not running in developer mode.'
                  );
              }
            : () => {
                  window.location.reload();
              },
        []
    );

    const renderErrors = useMemo(
        () =>
            renderError
                ? [errorRecord(renderError, window, useApp, renderError.stack)]
                : [],
        [renderError]
    );

    const errors = renderError ? renderErrors : unhandledErrors;
    const handleDismissError = renderError ? reload : markErrorHandled;

    const { closeDrawer } = appApi;
    const { drawer, hasBeenOffline, isOnline, overlay } = appState;
    const isCartOpen = drawer === 'cart';

    useEffect(() => {
        if (hasBeenOffline) {
            if (isOnline) {
                handleIsOnline();
            } else {
                handleIsOffline();
            }
        }
    }, [handleIsOnline, handleIsOffline, hasBeenOffline, isOnline]);

    // Only add toasts for errors if the errors list changes. Since `addToast`
    // and `toasts` changes each render we cannot add it as an effect dependency
    // otherwise we infinitely loop.
    useEffect(() => {
        for (const { error, id, loc } of errors) {
            handleError(
                error,
                id,
                loc,
                getErrorDismisser(error, handleDismissError)
            );
        }
    }, [errors, handleDismissError]); // eslint-disable-line

    const handleCloseDrawer = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    return {
        hasOverlay: !!overlay,
        handleCloseDrawer,
        isCartOpen
    };
};
