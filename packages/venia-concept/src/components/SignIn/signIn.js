import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import defaultClasses from './signIn.css';
import classify from 'src/classify';
import Form from 'src/components/Form';

class SignIn extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            signInSection: PropTypes.string,
            signInDivider: PropTypes.string,
            forgotPassword: PropTypes.string,
            root: PropTypes.string
        }),

        signInError: PropTypes.object,
        signIn: PropTypes.func
    };

    state = {
        password: '',
        username: ''
    };

    get errorMessage() {
        const { classes, signInError } = this.props;
        const isErrorEmpty = Object.keys(signInError).length === 0;
        return !isErrorEmpty ? (
            <div className={classes.signInError}>
                <p> {signInError.message} </p>
            </div>
        ) : null;
    }

    render() {
        const { classes, showCreateAccountForm } = this.props;
        const { onSignIn, errorMessage } = this;

        return (
            <div className={classes.root}>
                <Form submitForm={onSignIn}>
                    <Input
                        onChange={this.updateUsername}
                        helpText={'example help text'}
                        label={'Username or Email'}
                        required={true}
                    />

                    <Input
                        onChange={this.updatePassword}
                        errorText={
                            'Password must be at least 8 characters long'
                        }
                        errorVisible={this.passwordError()}
                        label={'Password'}
                        type={'password'}
                        helpText={'example help text'}
                        required={true}
                    />
                    <div className={classes.signInButton}>
                        <Button type="submit">Sign In</Button>
                    </div>
                    {errorMessage}
                    <div className={classes.forgotPassword}>
                        <a href="/"> Forgot your username or password? </a>
                    </div>
                </Form>
                <div className={classes.signInDivider} />
                <div className={classes.signInButton}>
                    <Button onClick={showCreateAccountForm}> Create an Account </Button>
                </div>
            </div>
        );
    }

    passwordError() {
        return this.state.password.length < 8;
    }

    onSignIn = () => {
        const { username, password } = this.state;
        this.props.signIn({ username: username, password: password });
    };

    onCreateAccount = () => {
        this.props.createAccount(mockAccount);
    };

    updatePassword = newPassword => {
        this.setState({ password: newPassword });
    };

    updateUsername = newUsername => {
        this.setState({ username: newUsername });
    };
}

export default classify(defaultClasses)(SignIn);
