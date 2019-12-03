import React from 'react';
import { func, shape, string } from 'prop-types';

import { useAuthModal } from '@magento/peregrine/lib/talons/AuthModal/useAuthModal';

import { mergeClasses } from '../../classify';
import defaultClasses from './authModal.css';

const CreateAccount = React.lazy(() => import('../CreateAccount'));
const ForgotPassword = React.lazy(() => import('../ForgotPassword'));
const MyAccount = React.lazy(() => import('../MyAccount'));
const SignIn = React.lazy(() => import('../SignIn'));
const AuthModal = props => {
    const {
        handleClose,
        handleCreateAccount,
        handleSignOut,
        setUsername,
        showCreateAccount,
        showForgotPassword,
        showMyAccount,
        username
    } = useAuthModal(props);

    let child = null;
    switch (props.view) {
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
                    onClose={handleClose}
                />
            );
            break;
        }
        case 'MY_ACCOUNT': {
            child = (
                <MyAccount onSignOut={handleSignOut} />
            );
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

    const classes = mergeClasses(defaultClasses, props.classes);
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
