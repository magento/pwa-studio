import React, { useContext, useEffect, useState } from 'react';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import CreateAccount from '../CreateAccount';
import ForgotPassword from '../ForgotPassword';
import MyAccount from '../MyAccount';
import SignIn from '../SignIn';
import { UserContext } from '../Navigation';
import defaultClasses from './authModal.css';

const noop = () => {};
const UNAUTHED_ONLY = ['CREATE_ACCOUNT', 'FORGOT_PASSWORD', 'SIGN_IN'];

const AuthModal = props => {
    const {
        showCreateAccount,
        showForgotPassword,
        showMyAccount,
        view
    } = props;

    const [username, setUsername] = useState('');
    const [userState, { createAccount, signOut }] = useContext(UserContext);
    const { currentUser } = userState;
    const classes = mergeClasses(defaultClasses, props.classes);
    let child = null;

    // if the user is authed, the only valid view is "MY_ACCOUNT"
    useEffect(() => {
        if (currentUser && currentUser.id && UNAUTHED_ONLY.includes(view)) {
            showMyAccount();
        }
    }, [currentUser, showMyAccount, view]);

    switch (view) {
        case 'CREATE_ACCOUNT': {
            child = (
                <CreateAccount
                    createAccount={createAccount}
                    initialValues={{ email: username }}
                    onSubmit={showMyAccount}
                />
            );
            break;
        }
        case 'FORGOT_PASSWORD': {
            child = (
                <ForgotPassword
                    initialValues={{ email: username }}
                    onClose={noop}
                />
            );
            break;
        }
        case 'MY_ACCOUNT': {
            child = <MyAccount signOut={signOut} user={currentUser} />;
            break;
        }
        case 'SIGN_IN': {
            child = (
                <SignIn
                    setDefaultUsername={setUsername}
                    showCreateAccount={showCreateAccount}
                    showForgotPassword={showForgotPassword}
                    showMyAccount={showMyAccount}
                />
            );
            break;
        }
    }

    return <div className={classes.root}>{child}</div>;
};

export default AuthModal;

AuthModal.propTypes = {
    classes: shape({
        root: string
    }),
    showCreateAccount: func.isRequired,
    showForgotPassword: func.isRequired,
    showMyAccount: func.isRequired,
    view: string.isRequired
};
