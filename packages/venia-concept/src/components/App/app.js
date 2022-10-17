import React, { useCallback, Suspense, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { array, func, shape, string } from 'prop-types';

import { useToasts } from '@magento/peregrine';
import { useApp } from '@magento/peregrine/lib/talons/App/useApp';

import globalCSS from '@magento/venia-ui/lib/index.module.css';
import { HeadProvider, StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Main from '../Main';
import Mask from '@magento/venia-ui/lib/components/Mask';
import Routes from '@magento/venia-ui/lib/components/Routes';
import ToastContainer from '@magento/venia-ui/lib/components/ToastContainer';
import Icon from '@magento/venia-ui/lib/components/Icon';

import { useHistory } from 'react-router-dom';
import ReactGA from 'react-ga';

import CookiesMsg from '@orienteed/customComponents/components/CookiesConsent'

ReactGA.initialize('UA-158777378-4');
ReactGA.plugin.require('ecommerce');
ReactGA.pageview(window.location.pathname + window.location.search);

import { AlertCircle as AlertCircleIcon, CloudOff as CloudOffIcon, Wifi as WifiIcon } from 'react-feather';

const Navigation = React.lazy(() => import('@magento/venia-ui/lib/components/Navigation'));

const OnlineIcon = <Icon src={WifiIcon} attrs={{ width: 18 }} />;
const OfflineIcon = <Icon src={CloudOffIcon} attrs={{ width: 18 }} />;
const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

const App = props => {
    const { markErrorHandled, renderError, unhandledErrors } = props;
    const { formatMessage } = useIntl();

    const [, { addToast }] = useToasts();

    const { location } = useHistory();
    const { pathname } = location;
    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, [pathname]);
    const ERROR_MESSAGE = formatMessage({
        id: 'app.errorUnexpected',
        defaultMessage: 'Sorry! An unexpected error occurred.'
    });

    const handleIsOffline = useCallback(() => {
        addToast({
            type: 'error',
            icon: OfflineIcon,
            message: formatMessage({
                id: 'app.errorOffline',
                defaultMessage: 'You are offline. Some features may be unavailable.'
            }),
            timeout: 3000
        });
    }, [addToast, formatMessage]);

    const handleIsOnline = useCallback(() => {
        addToast({
            type: 'info',
            icon: OnlineIcon,
            message: formatMessage({
                id: 'app.infoOnline',
                defaultMessage: 'You are online.'
            }),
            timeout: 3000
        });
    }, [addToast, formatMessage]);

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
        [ERROR_MESSAGE, addToast]
    );

    const talonProps = useApp({
        handleError,
        handleIsOffline,
        handleIsOnline,
        markErrorHandled,
        renderError,
        unhandledErrors
    });

    const { hasOverlay, handleCloseDrawer } = talonProps;

    if (renderError) {
        return (
            <HeadProvider>
                <StoreTitle />
                <Main isMasked={true} />
                <Mask isActive={true} />
                <ToastContainer />
            </HeadProvider>
        );
    }

    return (
        <HeadProvider>
            <StoreTitle />
            <Main isMasked={hasOverlay}>
                <CookiesMsg/>
                <Routes />
            </Main>
            <Mask isActive={hasOverlay} dismiss={handleCloseDrawer} />
            <Suspense fallback={null}>
                <Navigation />
            </Suspense>
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

App.globalCSS = globalCSS;

export default App;
