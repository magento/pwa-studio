import React, { createContext, useMemo } from 'react';
import { bindActionCreators } from 'redux';

import actions from '@magento/peregrine/lib/store/actions/app/actions';
import * as asyncActions from '@magento/peregrine/lib/store/actions/app/asyncActions';
import { connect } from '../drivers';

export const AppContext = createContext();

const AppContextProvider = props => {
    const { actions, appState, asyncActions, children } = props;

    const appApi = useMemo(
        () => ({
            actions,
            ...asyncActions
        }),
        [actions, asyncActions]
    );

    const contextValue = useMemo(() => [appState, appApi], [appApi, appState]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

const mapStateToProps = ({ app }) => ({ appState: app });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    asyncActions: bindActionCreators(asyncActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppContextProvider);
