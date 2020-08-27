import React from 'react';
import { func, shape, string } from 'prop-types';

import { useAuthModal } from '@magento/peregrine/lib/talons/AuthModal/useAuthModal';

import CreateAccount from '../CreateAccount';
import ForgotPassword from '../ForgotPassword';
import MyAccount from '../MyAccount';
import SignIn from '../SignIn';
import { mergeClasses } from '../../classify';

import SIGN_OUT_MUTATION from '../../queries/signOut.graphql';

import defaultClasses from './authModal.css';

const AuthModal = props => {
    const {
        handleCancel,
        handleCreateAccount,
        handleSignOut,
        setUsername,
        showCreateAccount,
        showForgotPassword,
        showMyAccount,
        username
    } = useAuthModal({
        ...props,
        signOutMutation: SIGN_OUT_MUTATION
    });

    let child = null;
    switch (props.view) {
        case 'CREATE_ACCOUNT': {
            child = (
                <CreateAccount
                    initialValues={{ email: username }}
                    isCancelButtonHidden={false}
                    onSubmit={handleCreateAccount}
                    onCancel={handleCancel}
                />
            );
            break;
        }
        case 'FORGOT_PASSWORD': {
            child = (
                <ForgotPassword
                    initialValues={{ email: username }}
                    onCancel={handleCancel}
                />
            );
            break;
        }
        case 'MY_ACCOUNT': {
            child = <MyAccount onSignOut={handleSignOut} />;
            break;
        }
        case 'SIGN_IN':
        default: {
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
    closeDrawer: func.isRequired,
    showCreateAccount: func.isRequired,
    showForgotPassword: func.isRequired,
    showMyAccount: func.isRequired,
    showMainMenu: func.isRequired,
    showSignIn: func.isRequired,
    view: string
};
