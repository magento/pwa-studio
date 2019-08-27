import React, { createContext, useMemo } from 'react';

import {
    createAccount,
    getUserDetails,
    signIn,
    signOut
} from '../actions/user';
import { connect } from '../drivers';

export const UserContext = createContext();

const UserContextProvider = props => {
    const {
        children,
        createAccount,
        getUserDetails,
        signIn,
        signOut,
        user: userState
    } = props;

    const userApi = useMemo(
        () => ({
            createAccount,
            getUserDetails,
            signIn,
            signOut
        }),
        [createAccount, getUserDetails, signIn, signOut]
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

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = {
    createAccount,
    getUserDetails,
    signIn,
    signOut
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserContextProvider);
