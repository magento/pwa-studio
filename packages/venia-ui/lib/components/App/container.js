import React, { useContext } from 'react';

import App from './app';
import { useErrorBoundary } from './useErrorBoundary';
import { AppContext } from '../../context/app';
import { ErrorContext } from '../../context/unhandledErrors';

const AppContainer = () => {
    const ErrorBoundary = useErrorBoundary(App);
    const [appState, appApi] = useContext(AppContext);
    const [unhandledErrors, errorApi] = useContext(ErrorContext);

    return (
        <ErrorBoundary
            unhandledErrors={unhandledErrors}
            app={appState}
            {...appApi}
            {...errorApi}
        />
    );
};

export default AppContainer;
