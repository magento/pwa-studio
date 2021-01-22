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

type useAppProps = {
    handleError: Function;
    handleIsOffline: Function;
    handleIsOnline: Function;
    markErrorHandled: Function;
    renderError: Error;
    unhandledErrors: Array<Error>;
};

/**
 * Handles effects for App and returns props necessary for rendering
 * the app.
 *
 * @remarks
 * This method is part of the {@link Peregrine | Peregrine Talon Library}.
 *
 * @param handleError       - The callback to invoke for each error
 * @param handleIsOffline   - The callback to invoke when the app goes offline
 * @param handleIsOnline    - callback to invoke wen the app goes online
 * @param handleHTMLUpdate  - callback to invoke when a HTML update is available
 * @param markErrorHandled  - callback to invoke when handling an error
 * @param renderError       - an error that occurs during rendering of the app
 * @param unhandledErrors   - errors coming from the error reducer
 *
 * @returns an object containing the hasOverlay boolean and handleCloseDrawer callback function
 */
export const useApp = (
    props: useAppProps
): {
    hasOverlay: boolean;
    handleCloseDrawer: Function;
} => {
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
    }, [errors, handleDismissError, handleError]);

    const [appState, appApi] = useAppContext();
    const { closeDrawer } = appApi;
    const { hasBeenOffline, isOnline, overlay } = appState;

    useEffect(() => {
        if (hasBeenOffline) {
            if (isOnline) {
                handleIsOnline();
            } else {
                handleIsOffline();
            }
        }
    }, [handleIsOnline, handleIsOffline, hasBeenOffline, isOnline]);

    const handleCloseDrawer = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    return {
        hasOverlay: !!overlay,
        handleCloseDrawer
    };
};
