import { createElement, Component } from 'react';
import { RestApi } from '@magento/peregrine';
import { logInUser } from 'src/actions/login';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import defaultClasses from './login.css';
import classify from 'src/classify';
import { compose } from 'redux';
import { connect } from 'react-redux';

const { request } = RestApi.Magento2;

class Login extends Component {
    state = ({
        password: '',
        username: ''
    });

    render() {
        return (
            <div>
                <Input
                onChange={this.updateUsername}
                helpText={'example help text'}
                label={'Username or Email'}
                onSubmit={this.login} />

                <Input
                onChange={this.updatePassword}
                onSubmit={this.login}
                errorText={'Password must be at least 3 characters long'}
                errorVisible={this.passwordError()}
                label={'Password'}
                type={'password'} />


                <Button onClick={this.login}>Log In</Button>
            </div>
        );
    }

    login = () => {
        const credentials = {
            username: this.state.username,
            password: this.state.password
        }
        this.props.logInUser(credentials);
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

const mapDispatchToProps = {logInUser};

export default compose(classify(defaultClasses), connect(null, mapDispatchToProps))(Login)
