import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import defaultClasses from './signIn.css';
import classify from 'src/classify';
import { Form } from 'informed';
import ErrorDisplay from 'src/components/ErrorDisplay';

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

        signInError: PropTypes.object,
        signIn: PropTypes.func,
        onForgotPassword: PropTypes.func.isRequired
    };

    state = {
        password: '',
        username: ''
    };

    get errorMessage() {
        const { signInError } = this.props;
        return <ErrorDisplay error={signInError} />;
    }

    render() {
        const { classes } = this.props;
        const { onSignIn, errorMessage } = this;

        return (
            <div className={classes.root}>
                <Form onSubmit={onSignIn}>
                    <Input
                        onChange={this.updateUsername}
                        helpText={'example help text'}
                        label={'Username or Email'}
                        required={true}
                        autoComplete={'username'}
                        field="username"
                    />
                    <Input
                        onChange={this.updatePassword}
                        label={'Password'}
                        type={'password'}
                        helpText={'example help text'}
                        required={true}
                        autoComplete={'current-password'}
                        field="password"
                    />
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
                    <Button onClick={this.showCreateAccountForm}>
                        {' '}
                        Create an Account{' '}
                    </Button>
                </div>
            </div>
        );
    }

    onSignIn = () => {
        const { username, password } = this.state;
        this.props.signIn({ username: username, password: password });
    };

    showCreateAccountForm = () => {
        this.props.setDefaultUsername(this.state.username);
        this.props.showCreateAccountForm();
    };

    handleForgotPassword = () => {
        this.props.setDefaultUsername(this.state.username);
        this.props.onForgotPassword();
    };

    updatePassword = newPassword => {
        this.setState({ password: newPassword });
    };

    updateUsername = newUsername => {
        this.setState({ username: newUsername });
    };
}

export default classify(defaultClasses)(SignIn);
