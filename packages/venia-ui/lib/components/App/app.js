import React, { useCallback, useEffect } from 'react';
import { array, func, shape, string } from 'prop-types';

import { getToastId, useToasts } from '@magento/peregrine';
import { useApp } from '@magento/peregrine/lib/talons/App/useApp';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import { HeadProvider, Title } from '../Head';
import Main from '../Main';
import Mask from '../Mask';
import MiniCart from '../MiniCart';
import Navigation from '../Navigation';
import renderRoutes from './renderRoutes';
import { registerMessageHandler } from '../../util/swUtils';
import { HTML_UPDATE_AVAILABLE } from '../../constants/messageTypes';
import ToastContainer from '../ToastContainer';
import Icon from '../Icon';

import {
    AlertCircle as AlertCircleIcon,
    CloudOff as CloudOffIcon,
    Wifi as WifiIcon,
    RefreshCcw as RefreshIcon
} from 'react-feather';

const OnlineIcon = <Icon src={WifiIcon} attrs={{ width: 18 }} />;
const OfflineIcon = <Icon src={CloudOffIcon} attrs={{ width: 18 }} />;
const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;
const UpdateIcon = <Icon src={RefreshIcon} attrs={{ width: 18 }} />;

const ERROR_MESSAGE = 'Sorry! An unexpected error occurred.';

const App = props => {
    const { markErrorHandled, renderError, unhandledErrors } = props;

    const [{ toasts }, { addToast }] = useToasts();

    const [, appApi] = useAppContext();

    const {
        actions: { htmlUpdateAvailable }
    } = appApi;

    useEffect(() => {
        const unregisterHandler = registerMessageHandler(
            HTML_UPDATE_AVAILABLE,
            () => {
                htmlUpdateAvailable();
            }
        );
        return unregisterHandler;
    }, [htmlUpdateAvailable]);

    const handleIsOffline = useCallback(() => {
        addToast({
            type: 'error',
            icon: OfflineIcon,
            message: 'You are offline. Some features may be unavailable.',
            timeout: 3000
        });
    }, [addToast]);

    const handleIsOnline = useCallback(() => {
        addToast({
            type: 'info',
            icon: OnlineIcon,
            message: 'You are online.',
            timeout: 3000
        });
    }, [addToast]);

    const handleHTMLUpdate = useCallback(
        resetUpdateAvaiableFlag => {
            addToast({
                type: 'warning',
                icon: UpdateIcon,
                message: 'Update available. Please refresh.',
                actionText: 'Refresh',
                timeout: 0,
                onAction: () => {
                    resetUpdateAvaiableFlag();
                    location.reload();
                },
                onDismiss: removeToast => {
                    resetUpdateAvaiableFlag();
                    removeToast();
                }
            });
        },
        [addToast]
    );

    const handleError = useCallback(
        (error, id, loc, handleDismissError) => {
            const errorToastProps = {
                icon: ErrorIcon,
                message: `${ERROR_MESSAGE}\nDebug: ${id} ${loc}`,
                onDismiss: remove => {
                    handleDismissError();
                    remove();
                },
                timeout: 15000,
                type: 'error'
            };
            // Only add a toast for new errors. Without this condition we would
            // re-add toasts when one error is removed even if there were two
            // added at the same time.
            const errorToastId = getToastId(errorToastProps);
            if (!toasts.get(errorToastId)) {
                addToast(errorToastProps);
            }
        },
        [addToast, toasts]
    );

    const talonProps = useApp({
        handleError,
        handleIsOffline,
        handleIsOnline,
        handleHTMLUpdate,
        markErrorHandled,
        renderError,
        unhandledErrors
    });

    const { hasOverlay, handleCloseDrawer } = talonProps;

    if (renderError) {
        return (
            <HeadProvider>
                <Title>{`Home Page - ${STORE_NAME}`}</Title>
                <Main isMasked={true} />
                <Mask isActive={true} />
                <ToastContainer />
            </HeadProvider>
        );
    }

    return (
        <HeadProvider>
            <Title>{`Home Page - ${STORE_NAME}`}</Title>
            <Main isMasked={hasOverlay}>{renderRoutes()}</Main>
            <Mask isActive={hasOverlay} dismiss={handleCloseDrawer} />
            <Navigation />
            <MiniCart />
            <ToastContainer />
        </HeadProvider>
    );
};

App.propTypes = {
    markErrorHandled: func.isRequired,
    renderError: shape({
        stack: string
    }),
    unhandledErrors: array
};

export default App;
