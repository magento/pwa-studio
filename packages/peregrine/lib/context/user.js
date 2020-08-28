import React, { createContext, useContext, useMemo } from 'react';
import { connect } from 'react-redux';

import actions from '../store/actions/user/actions';
import * as asyncActions from '../store/actions/user/asyncActions';
import bindActionCreators from '../util/bindActionCreators';

const UserContext = createContext();

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

/**
 * @typedef {Object} UserState
 *
 * @property {CurrentUser} currentUser Current user details
 * @property {Error} getDetailsError Get Details call related error
 * @property {Boolean} isGettingDetails Boolean if true indicates that user details are being fetched. False otherwise.
 * @property {Boolean} isResettingPassword Deprecated
 * @property {Boolean} isSignedIn Boolean if true indicates that the user is signed in. False otherwise.
 * @property {Error} resetPasswordError Deprecated
 *
 */

/**
 * @typedef {Object} CurrentUser
 *
 * @property {String} email Current user's email
 * @property {String} firstname Current user's first name
 * @property {String} lastname Current user's last name
 */

/**
 * @typedef {Object} UserActions
 *
 * @property {Function} clearToken Callback to clear user token in browser persistence storage
 * @property {Function} getUserDetails Callback to get user details
 * @property {Function} resetPassword Deprecated
 * @property {Function} setToken Callback to set user token in browser persistence storage
 * @property {Function} signOut Callback to sign the user out
 */

/**
 * @returns {[UserState, UserActions]}
 */
export const useUserContext = () => useContext(UserContext);
