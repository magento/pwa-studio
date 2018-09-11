import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import defaultClasses from './signIn.css';
import classify from 'src/classify';
import { Link } from 'react-router-dom';

class SignIn extends Component {
    static propTypes = {
        signInError: PropTypes.object,
        signIn: PropTypes.function
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
        const { classes } = this.props;
        const { onSignIn, errorMessage } = this;
        return (
            <div className={classes.root}>
                <form onSubmit={onSignIn} className={classes.signInSection}>
                    <Input
                        onChange={this.updateUsername}
                        helpText={'example help text'}
                        label={'Username or Email'}
                    />

                    <Input
                        onChange={this.updatePassword}
                        errorText={
                            'Password must be at least 3 characters long'
                        }
                        errorVisible={this.passwordError()}
                        label={'Password'}
                        type={'password'}
                    />

                    <Button type="submit">Sign In</Button>
                    <div className={classes.forgotPassword}>
                        <Link to=""> Forgot your username or password? </Link>
                    </div>
                    {errorMessage}
                </form>
                <div className={classes.signInDivider} />
                <div className={classes.signInSection}>
                    <Button> Create Account </Button>
                </div>
            </div>
        );
    }

    passwordError() {
        return this.state.password.length < 3;
    }

    onSignIn = event => {
        event.preventDefault();
        const { username, password } = this.state;
        this.props.signIn({ username: username, password: password });
    };

    submitPassword = password => {
        console.log(password);
    };

    updatePassword = newPassword => {
        this.setState({ password: newPassword });
    };

    updateUsername = newUsername => {
        this.setState({ username: newUsername });
    };

    logChange = change => {
        console.log('val', change);
    };
}

export default classify(defaultClasses)(SignIn);
