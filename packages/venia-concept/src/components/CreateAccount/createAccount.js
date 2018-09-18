import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import defaultClasses from './createAccount.css';
import classify from 'src/classify';
import Form from 'src/components/Form';
import { debounce } from 'underscore';
import { RestApi } from '@magento/peregrine';
import ErrorDisplay from 'src/components/ErrorDisplay';
import Checkbox from 'src/components/Checkbox';

const { request } = RestApi.Magento2;

class CreateAccount extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            createAccountError: PropTypes.string
        }),

        createAccountError: PropTypes.object,
        createAccount: PropTypes.func
    };

    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
        subscribe: false,
        checkingEmail: false,
        emailAvailable: false,
        subscribe: true
    };

    get errorMessage() {
        const { createAccountError } = this.props;
        return <ErrorDisplay error={createAccountError} />
    }

    get hasEmailError() {
        return !!this.state.email && !this.state.emailAvailable && !this.state.checkingEmail;
    }

    get passwordConfirmError() {
        return this.state.password !== this.state.passwordConfirm;
    }

    get disableAccountCreation() {
        return this.hasEmailError || this.passwordConfirmError || !this.state.email;
    }

    render() {
        const { classes } = this.props;
        const { onCreateAccount, errorMessage, hasEmailError, disableAccountCreation, passwordConfirmError } = this;
        return (
            <div className={classes.root}>
                <Form submitForm={onCreateAccount}>

                    <div className={classes.rewards}>
                        <span>An account gives you access to rewards!</span>
                    </div>

                    <Input
                        onChange={this.updateEmail}
                        selected={true}
                        label={'Email'}
                        helpText={'Use an active email address'}
                        required={true}
                        errorText={'Email is not available'}
                        errorVisible={hasEmailError}
                    />

                    <Input
                        onChange={this.updateName}
                        label={'Name'}
                    />

                    <Input
                        onChange={this.updatePassword}
                        label={'Password'}
                        type={'password'}
                        required={true}
                        placeholder={'Enter a password'}
                        helpText={'Password must be at least 8 characters long and contain 3 or more of the following: Lowercase, Uppercase, Digits, or Special Characters. (ex. Password1)'}
                    />

                    <Input
                        onChange={this.updatePasswordConfirm}
                        label={'Confirm Password'}
                        type={'password'}
                        required={true}
                        placeholder={'Enter the password again'}
                        errorText={'Passwords must match'}
                        errorVisible={passwordConfirmError}
                    />

                <Checkbox label={'Subscribe to news and updates'} select={this.handleCheckboxChange} initialState={this.state.subscribe} />
                <div className={classes.createAccountButton}>
                    <Button type="submit" disabled={disableAccountCreation}>Create Account</Button>
                </div>
                </Form>
            </div>
        );
    }

    onCreateAccount = () => {
        if (!this.disableAccountCreation) {
            const newCustomer = {
                customer: {
                    firstname: this.state.name,
                    lastname: this.state.name,
                    email: this.state.email,
                },
                password: this.state.password
            }
            this.props.createAccount(newCustomer);
        }
    };

    handleCheckboxChange = value => {
        this.setState({subscribe: value})
    }

     checkEmail = debounce(async (email) => {
        try {
            const body = {
                customerEmail: email,
                website_id: null
            }
            const response = await request('/rest/V1/customers/isEmailAvailable', {
                method: 'POST',
                body: JSON.stringify(body)
            });
            this.setState({emailAvailable: response, checkingEmail: false})
        } catch (error) {
            console.warn('err: ', error)
        }
    }, 300);

    updateName = newName => {
        this.setState({ name: newName });
    };

    updateEmail = newEmail => {
        this.setState({checkingEmail: true, email: newEmail});
        this.checkEmail(newEmail);
    };

    updatePassword = newPassword => {
        this.setState({ password: newPassword });
    };

    updatePasswordConfirm = newPasswordConfirm => {
        this.setState({ passwordConfirm: newPasswordConfirm });
    };

}

export default classify(defaultClasses)(CreateAccount);
