import React, { Fragment, useCallback, useEffect } from 'react';
import { array, bool, func, shape, string } from 'prop-types';

import Main from 'src/components/Main';
import Mask from 'src/components/Mask';
import MiniCart from 'src/components/MiniCart';
import Navigation from 'src/components/Navigation';
import renderRoutes from './renderRoutes';
import errorRecord from 'src/util/createErrorRecord';
import AlertCircleIcon from 'react-feather/dist/icons/alert-circle';

import { useToastActions } from '@magento/peregrine';

const dismissers = new WeakMap();

const App = props => {
    const { renderError } = props;
    const { addToast } = useToastActions();

    let errors = props.unhandledErrors;

    if (renderError) {
        errors = [errorRecord(renderError, window, this, renderError.stack)];
    }

    const recoverFromRenderError = useCallback(() => {
        window.location.reload();
    }, []);

    // Memoize dismisser funcs to reduce re-renders from func identity change.
    const getErrorDismisser = (error, onDismissError) => {
        return dismissers.has(error)
            ? dismissers.get(error)
            : dismissers.set(error, () => onDismissError(error)).get(error);
    };

    useEffect(() => {
        const toasts = errors.map(({ error, id, loc }) => {
            let onDismissError;
            if (renderError) {
                onDismissError = recoverFromRenderError;
            } else {
                onDismissError = props.markErrorHandled;
            }

            return {
                type: 'error',
                message: `Sorry! An unexpected error occurred.\nDebug: ${id} ${loc}`,
                icon: AlertCircleIcon,
                dismissable: true,
                timeout: 7000,
                onDismiss: getErrorDismisser(error, onDismissError)
            };
        });

        // TODO: Fix the infinite reload/render of this toast.
        // Each toast addition triggers a re-render of the App. This may be due
        // to the use of the context wrapper. Currently this is broken.
        toasts.forEach(addToast);
    }, [addToast, errors]);

    if (renderError) {
        return (
            <Fragment>
                <Main isMasked={true} />
                <Mask isActive={true} />
            </Fragment>
        );
    } else {
        const {
            app: { drawer, hasBeenOffline, isOnline, overlay },
            closeDrawer
        } = props;

        const navIsOpen = drawer === 'nav';
        const cartIsOpen = drawer === 'cart';

        return (
            <Fragment>
                <Main
                    isMasked={overlay}
                    hasBeenOffline={hasBeenOffline}
                    isOnline={isOnline}
                >
                    {renderRoutes()}
                </Main>
                <Mask isActive={overlay} dismiss={closeDrawer} />
                <Navigation isOpen={navIsOpen} />
                <MiniCart isOpen={cartIsOpen} />
            </Fragment>
        );
    }
};

App.propTypes = {
    app: shape({
        drawer: string,
        hasBeenOffline: bool,
        isOnline: bool,
        overlay: bool.isRequired
    }).isRequired,
    closeDrawer: func.isRequired,
    markErrorHandled: func.isRequired,
    renderError: shape({
        stack: string
    }),
    unhandledErrors: array
};

export default App;
