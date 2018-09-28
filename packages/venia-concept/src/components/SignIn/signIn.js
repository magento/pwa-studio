import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import defaultClasses from './signIn.css';
import classify from 'src/classify';
import Form from 'src/components/Form';
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
        signIn: PropTypes.func
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
                        autoComplete={'username'}
                    />

                    <Input
                        onChange={this.updatePassword}
                        label={'Password'}
                        type={'password'}
                        helpText={'example help text'}
                        required={true}
                        autoComplete={'current-password'}
                    />
                    <div className={classes.signInButton}>
                        <Button type="submit">Sign In</Button>
                    </div>
                    <div className={classes.signInError}>{errorMessage}</div>
                    <div className={classes.forgotPassword}>
                        <a href="/"> Forgot your username or password? </a>
                    </div>
                </Form>
                <div className={classes.signInDivider} />
                <div className={classes.showCreateAccountButton}>
                    <Button onClick={showCreateAccountForm}>
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
