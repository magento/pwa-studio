import { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import errorRecord from '@magento/peregrine/lib/util/createErrorRecord';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import getStyles from '../../RestApi/S3/getStyles';

import { useModulesContext } from '../../context/modulesProvider';

const dismissers = new WeakMap();

// Memoize dismisser funcs to reduce re-renders from func identity change.
const getErrorDismisser = (error, onDismissError) => {
    return dismissers.has(error)
        ? dismissers.get(error)
        : dismissers.set(error, () => onDismissError(error)).get(error);
};

/**
 * Talon that handles effects for App and returns props necessary for rendering
 * the app.
 *
 * @param {Function} props.handleError callback to invoke for each error
 * @param {Function} props.handleIsOffline callback to invoke when the app goes offline
 * @param {Function} props.handleIsOnline callback to invoke wen the app goes online
 * @param {Function} props.handleHTMLUpdate callback to invoke when a HTML update is available
 * @param {Function} props.markErrorHandled callback to invoke when handling an error
 * @param {Function} props.renderError an error that occurs during rendering of the app
 * @param {Function} props.unhandledErrors errors coming from the error reducer
 *
 * @returns {{
 *  hasOverlay: boolean
 *  handleCloseDrawer: function
 * }}
 */
export const useApp = props => {
    const { handleError, handleIsOffline, handleIsOnline, markErrorHandled, renderError, unhandledErrors } = props;
    const history = useHistory();

    const { enabledModules, fetchEnabledModules } = useModulesContext();

    const reload = useCallback(() => {
        if (process.env.NODE_ENV !== 'development') {
            history.go(0);
        }
    }, [history]);

    const renderErrors = useMemo(
        () => (renderError ? [errorRecord(renderError, globalThis, useApp, renderError.stack)] : []),
        [renderError]
    );

    const errors = renderError ? renderErrors : unhandledErrors;
    const handleDismissError = renderError ? reload : markErrorHandled;

    // Only add toasts for errors if the errors list changes. Since `addToast`
    // and `toasts` changes each render we cannot add it as an effect dependency
    // otherwise we infinitely loop.
    useEffect(() => {
        for (const { error, id, loc } of errors) {
            handleError(error, id, loc, getErrorDismisser(error, handleDismissError));
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

    function applyStylesInApp(styles) {
        const stylekeys = Object.keys(styles);
        console.log("Applying styles: ", styles)
        for (const styleProps of stylekeys) {
            for (const tokenKey of Object.keys(styles[styleProps])) {
                document.documentElement.style.setProperty(tokenKey, styles[styleProps][tokenKey]);
            }
        }
    }
    
    function applyDefaultStyles() {
        import('../../../../venia-ui/lib/cssTokens.json').then(styles => {
            applyStylesInApp(styles);
        });
    }
    
    function applyStyles() {
    
        if (process.env.MULTITENANT_ENABLED === 'true') {
            getStyles()
              .then((styles) => {
                applyStylesInApp(styles)
            })
              .catch(() => {
                applyDefaultStyles()
            });
          } else {
            applyDefaultStyles();
          }
    }

    useEffect(() => {
        console.log("Enabled modules: ", enabledModules)
    }, [enabledModules]);

    useEffect(() => {
        applyStyles()
        fetchEnabledModules();
    }, []);

    return {
        hasOverlay: !!overlay,
        handleCloseDrawer
    };
};

