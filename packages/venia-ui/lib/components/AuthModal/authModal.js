import React, { Suspense } from 'react';
import { func, shape, string } from 'prop-types';
import LoadingIndicator from '../LoadingIndicator';
import { mergeClasses } from '../../classify';
import defaultClasses from './authModal.css';
import { useAuthModal } from '@magento/peregrine/lib/talons/AuthModal/useAuthModal';
import SIGN_OUT_MUTATION from '../../queries/signOut.graphql';

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
    } = useAuthModal({
        ...props,
        signOutMutation: SIGN_OUT_MUTATION
    });

    let child = null;
    switch (props.view) {
        case 'CREATE_ACCOUNT': {
            child = (
                <Suspense fallback={<LoadingIndicator />}>
                    <CreateAccount
                        initialValues={{ email: username }}
                        onSubmit={handleCreateAccount}
                    />
                </Suspense>
            );
            break;
        }
        case 'FORGOT_PASSWORD': {
            child = (
                <Suspense fallback={<LoadingIndicator />}>
                    <ForgotPassword
                        initialValues={{ email: username }}
                        onClose={handleClose}
                    />
                </Suspense>
            );
            break;
        }
        case 'MY_ACCOUNT': {
            child = (
                <Suspense fallback={<LoadingIndicator />}>
                    <MyAccount onSignOut={handleSignOut} />
                </Suspense>
            );
            break;
        }
        case 'SIGN_IN': {
            child = (
                <Suspense fallback={<LoadingIndicator />}>
                    <SignIn
                        setDefaultUsername={setUsername}
                        showCreateAccount={showCreateAccount}
                        showForgotPassword={showForgotPassword}
                        showMyAccount={showMyAccount}
                    />
                </Suspense>
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
