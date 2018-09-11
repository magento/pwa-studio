import { createElement, Component } from 'react';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import defaultClasses from './login.css';
import classify from 'src/classify';
import { Link } from 'react-router-dom';

class Login extends Component {
    state = ({
        password: '',
        username: ''
    });

    render() {
        const { classes, onLogin, loginError } = this.props;
        return (
            <div className={classes.root}>
                <form
                    onSubmit={onLogin}
                    className={classes.loginSection} >
                    <Input
                        onChange={this.updateUsername}
                        helpText={'example help text'}
                        label={'Username or Email'}/>

                    <Input
                        onChange={this.updatePassword}
                        errorText={'Password must be at least 3 characters long'}
                        errorVisible={this.passwordError()}
                        label={'Password'}
                        type={'password'} />


                    <Button type="submit" onClick={this.login}>Sign In</Button>
                    <div className={classes.forgotPassword}>
                        <Link to=""> Forgot your username or password? </Link>
                    </div>
                    <div>
                        <p> {loginError.message} </p>
                    </div>
                </form>
                <div className={classes.loginDivider}></div>
                <div className={classes.loginSection}>
                    <Button> Create Account </Button>
                </div>
            </div>
        );
    }

    passwordError() {
        return this.state.password.length < 3;
    }

    submitPassword = password => {
        console.log(password);
    }

    updatePassword = newPassword => {
        this.setState({password: newPassword})
    }

    updateUsername = newUsername => {
        this.setState({username: newUsername})
    }

    logChange = change => {
        console.log('val', change)
    }
}

export default classify(defaultClasses)(Login)
