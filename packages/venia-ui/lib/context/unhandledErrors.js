import React, { createContext, useMemo } from 'react';

import appActions from '../actions/app';
import { connect } from '../drivers';

export const ErrorContext = createContext();

const ErrorContextProvider = props => {
    const { children, markErrorHandled, unhandledErrors } = props;

    const errorApi = useMemo(
        () => ({
            markErrorHandled
        }),
        [markErrorHandled]
    );

    const contextValue = useMemo(() => [unhandledErrors, errorApi], [
        errorApi,
        unhandledErrors
    ]);

    return (
        <ErrorContext.Provider value={contextValue}>
            {children}
        </ErrorContext.Provider>
    );
};

const mapStateToProps = ({ unhandledErrors }) => ({ unhandledErrors });

const mapDispatchToProps = {
    markErrorHandled: appActions.markErrorHandled
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ErrorContextProvider);
