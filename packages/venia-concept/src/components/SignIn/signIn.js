import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';

import Button from 'src/components/Button';
import Field from 'src/components/Field';
import TextInput from 'src/components/TextInput';

import { isRequired } from 'src/util/formValidators';

import defaultClasses from './signIn.css';
import classify from 'src/classify';

class SignIn extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            signInSection: PropTypes.string,
            signInDivider: PropTypes.string,
            forgotPassword: PropTypes.string,
            root: PropTypes.string,
            signInError: PropTypes.string,
            showCreateAccountButton: PropTypes.string
        }),
        onForgotPassword: PropTypes.func.isRequired,
        setDefaultUsername: PropTypes.func,
        signIn: PropTypes.func,
        signInError: PropTypes.object
    };

    get errorMessage() {
        const { signInError } = this.props;
        const errorIsEmpty = Object.keys(signInError).length === 0;
        
        if (signInError && !errorIsEmpty) {
            return 'An error occurred. Please try again.';
        }
    }

    render() {
        const { classes } = this.props;
        const { onSignIn, errorMessage } = this;

        return (
            <div className={classes.root}>
                <Form getApi={this.setFormApi} onSubmit={onSignIn}>
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
                    <div className={classes.signInError}>{errorMessage}</div>
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
                    <Button priority="high" onClick={this.showCreateAccountForm}>
                        Create an Account
                    </Button>
                </div>
            </div>
        );
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
    }

    showCreateAccountForm = () => {
        const username = this.formApi.getValue('email');

        if (this.props.setDefaultUsername) {
            this.props.setDefaultUsername(username);
        }

        this.props.showCreateAccountForm();
    };
}

export default classify(defaultClasses)(SignIn);
