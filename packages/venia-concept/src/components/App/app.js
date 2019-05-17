import React, { Fragment, useCallback } from 'react';
import { array, bool, func, shape, string } from 'prop-types';

import Main from 'src/components/Main';
import Mask from 'src/components/Mask';
import MiniCart from 'src/components/MiniCart';
import Navigation from 'src/components/Navigation';
import ErrorNotifications from './errorNotifications';
import renderRoutes from './renderRoutes';
import errorRecord from 'src/util/createErrorRecord';

const App = (props) => {
    const { renderError } = props;

    const recoverFromRenderError = useCallback(() => {
        window.location.reload();
    }, []);

    if (renderError) {
        const errors = [
            errorRecord(renderError, window, this, renderError.stack)
        ];
        return (
            <Fragment>
                <Main isMasked={true} />
                <Mask isActive={true} />
                <ErrorNotifications
                    errors={errors}
                    onDismissError={recoverFromRenderError}
                />
            </Fragment>
        );
    } else {
        const {
            app: { drawer, hasBeenOffline, isOnline, overlay },
            closeDrawer,
            markErrorHandled,
            unhandledErrors
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
                <ErrorNotifications
                    errors={unhandledErrors}
                    onDismissError={markErrorHandled}
                />
            </Fragment>
        );
    }
}

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
    unhandledErrors: array,
};

export default App;
