import React, { useState } from 'react';

import { mergeClasses } from 'src/classify';
import CreateAccount from 'src/components/CreateAccount';
import ForgotPassword from 'src/components/ForgotPassword';
import MyAccountMenuPage from 'src/components/MyAccountMenuPage';
import SignIn from 'src/components/SignIn';
import defaultClasses from './authModal.css';

const noop = () => {};

const AuthForm = props => {
    const { showCreateAccount, showForgotPassword, view } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const [username, setUsername] = useState('');
    let child = null;

    switch (view) {
        case 'CREATE_ACCOUNT': {
            child = (
                <CreateAccount
                    initialValues={{ email: username }}
                    onSubmit={noop}
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
                    showCreateAccountForm={showCreateAccount}
                />
            );
            break;
        }
    }

    return <div className={classes.root}>{child}</div>;
};

export default AuthForm;
