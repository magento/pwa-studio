import React, { Component } from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import { Form } from 'informed';

import Button from 'src/components/Button';
import Field from 'src/components/Field';
import LoadingIndicator from 'src/components/LoadingIndicator';
import TextInput from 'src/components/TextInput';

import { isRequired } from 'src/util/formValidators';

import defaultClasses from './signIn.css';
import classify from 'src/classify';

class SignIn extends Component {
    static propTypes = {
        classes: shape({
            forgotPassword: string,
            form: string,
            modal: string,
            modal_active: string,
            root: string,
            showCreateAccountButton: string,
            signInDivider: string,
            signInError: string,
            signInSection: string
        }),
        isGettingDetails: bool,
        isSigningIn: bool,
        onForgotPassword: func.isRequired,
        setDefaultUsername: func,
        signIn: func,
        signInError: object
    };

    get errorMessage() {
        const { signInError } = this.props;
        const hasError = signInError && Object.keys(signInError).length;

        if (hasError) {
            // Note: we can't access the actual message that comes back from the server
            // without doing some fragile string manipulation. Hardcoded for now.
            return 'The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.';
        }
    }

    render() {
        const { classes, isGettingDetails, isSigningIn } = this.props;
        const { onSignIn, errorMessage } = this;

        if (isGettingDetails || isSigningIn) {
            return (
                <div className={classes.modal_active}>
                    <LoadingIndicator>Signing In</LoadingIndicator>
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <Form
                        className={classes.form}
                        getApi={this.setFormApi}
                        onSubmit={onSignIn}
                    >
                        <Field label="Email" required={true}>
                            <TextInput
                                autoComplete="email"
                                field="email"
                                validate={isRequired}
                                validateOnBlur
                            />
                        </Field>
                        <Field label="Password" required={true}>
                            <TextInput
                                autoComplete="current-password"
                                field="password"
                                type="password"
                                validate={isRequired}
                                validateOnBlur
                            />
                        </Field>
                        <div className={classes.signInButton}>
                            <Button priority="high" type="submit">
                                Sign In
                            </Button>
                        </div>
                        <div className={classes.signInError}>
                            {errorMessage}
                        </div>
                        <button
                            type="button"
                            className={classes.forgotPassword}
                            onClick={this.handleForgotPassword}
                        >
                            Forgot password?
                        </button>
                    </Form>
                    <div className={classes.signInDivider} />
                    <div className={classes.showCreateAccountButton}>
                        <Button
                            priority="high"
                            onClick={this.showCreateAccountForm}
                        >
                            Create an Account
                        </Button>
                    </div>
                </div>
            );
        }
    }

    handleForgotPassword = () => {
        const username = this.formApi.getValue('email');

        if (this.props.setDefaultUsername) {
            this.props.setDefaultUsername(username);
        }

        this.props.onForgotPassword();
    };

    onSignIn = () => {
        const username = this.formApi.getValue('email');
        const password = this.formApi.getValue('password');

        this.props.signIn({ username, password });
    };

    setFormApi = formApi => {
        this.formApi = formApi;
    };

    showCreateAccountForm = () => {
        const username = this.formApi.getValue('email');

        if (this.props.setDefaultUsername) {
            this.props.setDefaultUsername(username);
        }

        this.props.showCreateAccountForm();
    };
}

export default classify(defaultClasses)(SignIn);
