import React, { createContext, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '@magento/peregrine/lib/store/actions/user/actions';
import * as asyncActions from '@magento/peregrine/lib/store/actions/user/asyncActions';

export const UserContext = createContext();

const UserContextProvider = props => {
    const { actions, asyncActions, children, userState } = props;

    const userApi = useMemo(
        () => ({
            actions,
            ...asyncActions
        }),
        [actions, asyncActions]
    );

    const contextValue = useMemo(() => [userState, userApi], [
        userApi,
        userState
    ]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

const mapStateToProps = ({ user }) => ({ userState: user });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    asyncActions: bindActionCreators(asyncActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserContextProvider);
