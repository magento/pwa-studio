import React, { useEffect, useState } from 'react';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import CreateAccount from 'src/components/CreateAccount';
import ForgotPassword from 'src/components/ForgotPassword';
import MyAccountMenuPage from 'src/components/MyAccountMenuPage';
import SignIn from 'src/components/SignIn';
import defaultClasses from './authModal.css';

const noop = () => {};
const UNAUTHED_ONLY = ['CREATE_ACCOUNT', 'FORGOT_PASSWORD', 'SIGN_IN'];

const AuthForm = props => {
    const {
        createAccount,
        showCreateAccount,
        showForgotPassword,
        showMyAccount,
        user,
        view
    } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const [username, setUsername] = useState('');
    let child = null;

    // if the user is authed, the only valid view is "MY_ACCOUNT"
    useEffect(() => {
        if (user && user.id && UNAUTHED_ONLY.includes(view)) {
            showMyAccount();
        }
    }, [showMyAccount, user, view]);

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
            child = <MyAccountMenuPage onClose={noop} />;
            break;
        }
        case 'SIGN_IN': {
            child = (
                <SignIn
                    onForgotPassword={showForgotPassword}
                    setDefaultUsername={setUsername}
                    showCreateAccount={showCreateAccount}
                    showMyAccount={showMyAccount}
                />
            );
            break;
        }
    }

    return <div className={classes.root}>{child}</div>;
};

export default AuthForm;

AuthForm.propTypes = {
    classes: shape({
        root: string
    }),
    createAccount: func.isRequired,
    showCreateAccount: func.isRequired,
    showForgotPassword: func.isRequired,
    showMyAccount: func.isRequired,
    view: string.isRequired
};
