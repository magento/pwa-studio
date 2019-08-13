import React, { useCallback, useRef } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { Form } from 'informed';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import Field from '../Field';
import LoadingIndicator from '../LoadingIndicator';
import TextInput from '../TextInput';
import { isRequired } from '../../util/formValidators';

import defaultClasses from './signIn.css';

// Note: we can't access the actual message that comes back from the server
// without doing some fragile string manipulation. Hardcoded for now.
const ERROR_MESSAGE =
    'The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.';

const SignIn = props => {
    const {
        isGettingDetails,
        isSigningIn,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword,
        signIn,
        signInError
    } = props;

    const formRef = useRef(null);
    const classes = mergeClasses(defaultClasses, props.classes);
    const hasError = signInError && Object.keys(signInError).length;
    const errorMessage = hasError ? ERROR_MESSAGE : null;

    const handleSubmit = useCallback(
        ({ email: username, password }) => {
            signIn({ username, password });
        },
        [signIn]
    );

    const handleForgotPassword = useCallback(() => {
        const { current: form } = formRef;

        if (form) {
            setDefaultUsername(form.formApi.getValue('email'));
        }

        showForgotPassword();
    }, [setDefaultUsername, showForgotPassword]);

    const handleCreateAccount = useCallback(() => {
        const { current: form } = formRef;

        if (form) {
            setDefaultUsername(form.formApi.getValue('email'));
        }

        showCreateAccount();
    }, [setDefaultUsername, showCreateAccount]);

    // if a request is in progress, avoid rendering the form
    if (isGettingDetails || isSigningIn) {
        return (
            <div className={classes.modal_active}>
                <LoadingIndicator>{'Signing In'}</LoadingIndicator>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <Form
                ref={formRef}
                className={classes.form}
                onSubmit={handleSubmit}
            >
                <Field label="Email" required={true}>
                    <TextInput
                        autoComplete="email"
                        field="email"
                        validate={isRequired}
                    />
                </Field>
                <Field label="Password" required={true}>
                    <TextInput
                        autoComplete="current-password"
                        field="password"
                        type="password"
                        validate={isRequired}
                    />
                </Field>
                <div className={classes.signInError}>{errorMessage}</div>
                <div className={classes.signInButton}>
                    <Button priority="high" type="submit">
                        {'Sign In'}
                    </Button>
                </div>
            </Form>
            <div className={classes.forgotPasswordButton}>
                <Button
                    priority="low"
                    type="button"
                    onClick={handleForgotPassword}
                >
                    {'Forgot Password?'}
                </Button>
            </div>
            <div className={classes.signInDivider} />
            <div className={classes.createAccountButton}>
                <Button
                    priority="normal"
                    type="button"
                    onClick={handleCreateAccount}
                >
                    {'Create an Account'}
                </Button>
            </div>
        </div>
    );
};

export default SignIn;

SignIn.propTypes = {
    classes: shape({
        createAccountButton: string,
        form: string,
        forgotPasswordButton: string,
        root: string,
        signInButton: string,
        signInDivider: string,
        signInError: string
    }),
    isGettingDetails: bool,
    isSigningIn: bool,
    setDefaultUsername: func.isRequired,
    showCreateAccount: func.isRequired,
    showForgotPassword: func.isRequired,
    signIn: func.isRequired,
    signInError: shape({})
};
