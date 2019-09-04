import React, { useContext } from 'react';
import { AppContext } from '@magento/peregrine/lib/context/app';
import { ErrorContext } from '@magento/peregrine/lib/context/unhandledErrors';

import App from './app';
import { useErrorBoundary } from './useErrorBoundary';

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
