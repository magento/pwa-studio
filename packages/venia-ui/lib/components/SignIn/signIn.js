import React from 'react';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import Field from '../Field';
import LoadingIndicator from '../LoadingIndicator';
import TextInput from '../TextInput';
import { isRequired } from '../../util/formValidators';

import defaultClasses from './signIn.css';
import { useSignIn } from '@magento/peregrine/lib/talons/SignIn/useSignIn';

const SignIn = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const {
        errorMessage,
        formRef,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy
    } = useSignIn(props);

    if (isBusy) {
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
                    classes={{
                        root_lowPriority: classes.forgotPasswordButtonRoot
                    }}
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
        forgotPasswordButtonRoot: string,
        root: string,
        signInButton: string,
        signInDivider: string,
        signInError: string
    }),
    setDefaultUsername: func.isRequired,
    showCreateAccount: func.isRequired,
    showForgotPassword: func.isRequired
};
