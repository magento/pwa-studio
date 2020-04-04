import React, { useCallback, useEffect } from 'react';
import { array, func, shape, string } from 'prop-types';

import { useToasts, useLocalization } from '@magento/peregrine';
import { useApp } from '@magento/peregrine/lib/talons/App/useApp';

import { HeadProvider, Title } from '../Head';
import Main from '../Main';
import Mask from '../Mask';
import MiniCart from '../MiniCart';
import Navigation from '../Navigation';
import Routes from '../Routes';
import { registerMessageHandler } from '../../util/swUtils';
import { HTML_UPDATE_AVAILABLE } from '../../constants/swMessageTypes';
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

const App = props => {
    const { markErrorHandled, renderError, unhandledErrors } = props;
    const [, { _t }] = useLocalization();
    const [, { addToast }] = useToasts();

    const ERROR_MESSAGE = _t('Sorry! An unexpected error occurred.');

    const handleIsOffline = useCallback(() => {
        addToast({
            type: 'error',
            icon: OfflineIcon,
            message: _t('You are offline. Some features may be unavailable.'),
            timeout: 3000
        });
    }, [addToast]);

    const handleIsOnline = useCallback(() => {
        addToast({
            type: 'info',
            icon: OnlineIcon,
            message: _t('You are online.'),
            timeout: 3000
        });
    }, [addToast]);

    const handleHTMLUpdate = useCallback(
        resetHTMLUpdateAvaiableFlag => {
            addToast({
                type: 'warning',
                icon: UpdateIcon,
                message: _t('Update available. Please refresh.'),
                actionText: _t('Refresh'),
                timeout: 0,
                onAction: () => {
                    location.reload();
                },
                onDismiss: removeToast => {
                    resetHTMLUpdateAvaiableFlag();
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

            addToast(errorToastProps);
        },
        [addToast]
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

    const {
        hasOverlay,
        handleCloseDrawer,
        setHTMLUpdateAvailable
    } = talonProps;

    useEffect(() => {
        const unregisterHandler = registerMessageHandler(
            HTML_UPDATE_AVAILABLE,
            () => {
                setHTMLUpdateAvailable(true);
            }
        );
        return unregisterHandler;
    }, [setHTMLUpdateAvailable]);

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
            <Main isMasked={hasOverlay}>
                <Routes />
            </Main>
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
