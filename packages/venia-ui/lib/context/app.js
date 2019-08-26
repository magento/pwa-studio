import React, { createContext, useMemo } from 'react';

import { closeDrawer } from '../actions/app';
import { connect } from '../drivers';

export const AppContext = createContext();

const AppContextProvider = props => {
    const { app: appState, children, closeDrawer } = props;

    const appApi = useMemo(
        () => ({
            closeDrawer
        }),
        [closeDrawer]
    );

    const contextValue = useMemo(() => [appState, appApi], [appApi, appState]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

const mapStateToProps = ({ app }) => ({ app });

const mapDispatchToProps = { closeDrawer };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppContextProvider);
