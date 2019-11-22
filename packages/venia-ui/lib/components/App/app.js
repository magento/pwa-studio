import React, { useCallback, useEffect, useState } from 'react';
import { array, func, shape, string } from 'prop-types';

import { useToasts } from '@magento/peregrine';
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

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useCheckoutContext } from '@magento/peregrine/lib/context/checkout';

const OnlineIcon = <Icon src={WifiIcon} attrs={{ width: 18 }} />;
const OfflineIcon = <Icon src={CloudOffIcon} attrs={{ width: 18 }} />;
const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;
const UpdateIcon = <Icon src={RefreshIcon} attrs={{ width: 18 }} />;

const ERROR_MESSAGE = 'Sorry! An unexpected error occurred.';

const App = props => {
    const { markErrorHandled, renderError, unhandledErrors } = props;

    const [, { addToast }] = useToasts();

    const [cartState, { createCart }] = useCartContext();
    const [, checkoutActions] = useCheckoutContext();
    const [isCreatingCart, setIsCreatingCart] = useState(false);

    // An effect that ensures we have a valid cart id. Dependencies on other
    // slice actions/state require these effects to live in App or below rather
    // than in the context providers themselves.
    useEffect(() => {
        async function resetCart() {
            checkoutActions.actions.reset();
            await createCart();
            setIsCreatingCart(false);
        }
        if (!cartState.cartId && !isCreatingCart) {
            setIsCreatingCart(true);
            resetCart();
        }
    }, [cartState.cartId, checkoutActions, createCart, isCreatingCart]);

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
        resetHTMLUpdateAvaiableFlag => {
            addToast({
                type: 'warning',
                icon: UpdateIcon,
                message: 'Update available. Please refresh.',
                actionText: 'Refresh',
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
