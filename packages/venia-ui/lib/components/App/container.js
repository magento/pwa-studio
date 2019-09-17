import React from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useErrorContext } from '@magento/peregrine/lib/context/unhandledErrors';

import App from './app';
import { useErrorBoundary } from './useErrorBoundary';

const AppContainer = () => {
    const ErrorBoundary = useErrorBoundary(App);
    const [appState, appApi] = useAppContext();
    const [unhandledErrors, errorApi] = useErrorContext();

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
