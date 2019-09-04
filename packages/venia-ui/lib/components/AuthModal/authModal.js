import React, { useCallback, useContext, useEffect, useState } from 'react';
import { func, shape, string } from 'prop-types';
import { UserContext } from '@magento/peregrine/lib/context/user';

import { mergeClasses } from '../../classify';
import CreateAccount from '../CreateAccount';
import ForgotPassword from '../ForgotPassword';
import MyAccount from '../MyAccount';
import SignIn from '../SignIn';
import defaultClasses from './authModal.css';

const UNAUTHED_ONLY = ['CREATE_ACCOUNT', 'FORGOT_PASSWORD', 'SIGN_IN'];

const AuthModal = props => {
    const {
        closeDrawer,
        showCreateAccount,
        showForgotPassword,
        showMainMenu,
        showMyAccount,
        view
    } = props;

    const [username, setUsername] = useState('');
    const [userState, { createAccount, signOut }] = useContext(UserContext);
    const { currentUser } = userState;
    const classes = mergeClasses(defaultClasses, props.classes);
    let child = null;

    const resetDrawer = useCallback(() => {
        showMainMenu();
        closeDrawer();
    }, [closeDrawer, showMainMenu]);

    // if the user is authed, the only valid view is "MY_ACCOUNT"
    useEffect(() => {
        if (currentUser && currentUser.id && UNAUTHED_ONLY.includes(view)) {
            showMyAccount();
        }
    }, [currentUser, showMyAccount, view]);

    const handleCreateAccount = useCallback(
        async values => {
            await createAccount(values);
            showMyAccount();
        },
        [createAccount, showMyAccount]
    );

    switch (view) {
        case 'CREATE_ACCOUNT': {
            child = (
                <CreateAccount
                    initialValues={{ email: username }}
                    onSubmit={handleCreateAccount}
                />
            );
            break;
        }
        case 'FORGOT_PASSWORD': {
            child = (
                <ForgotPassword
                    initialValues={{ email: username }}
                    onClose={resetDrawer}
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
    showMainMenu: func.isRequired,
    showMyAccount: func.isRequired,
    view: string.isRequired
};
