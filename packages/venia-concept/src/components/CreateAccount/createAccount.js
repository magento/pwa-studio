import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Input from 'src/components/Input';
import { HelpTypes } from 'src/components/Input';
import Button from 'src/components/Button';
import defaultClasses from './createAccount.css';
import classify from 'src/classify';
import { Form } from 'informed';
import { debounce } from 'underscore';
import { RestApi } from '@magento/peregrine';
import ErrorDisplay from 'src/components/ErrorDisplay';
import Checkbox from 'src/components/Checkbox';
import { fields } from './constants';

const { request } = RestApi.Magento2;

class CreateAccount extends PureComponent {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            createAccountError: PropTypes.string
        }),
        createAccountError: PropTypes.object,
        createAccount: PropTypes.func,
        defaultUsername: PropTypes.string
    };

    state = {
        subscribe: false,
        checkingEmail: false,
        emailAvailable: false,
        formFields: {
            [fields.firstName]: '',
            [fields.familyName]: '',
            [fields.email]: '',
            [fields.password]: '',
            [fields.confirmPassword]: ''
        }
    };

    get errorMessage() {
        const { createAccountError } = this.props;
        return <ErrorDisplay error={createAccountError} />;
    }

    get hasEmailError() {
        // Only return true if the email field has a value, and it's not being checked against existing emails
        return (
            !!this.getFieldValue(fields.email) &&
            !this.state.emailAvailable &&
            !this.state.checkingEmail
        );
    }

    get hasPasswordConfirmError() {
        // Check if passwords match
        return (
            this.getFieldValue(fields.password) !==
            this.getFieldValue(fields.confirmPassword)
        );
    }

    get isIncompleteOrInvalid() {
        // A catch-all to check if the form is valid so the customer can attempt to create an account
        return (
            this.hasEmailError ||
            this.hasPasswordConfirmError ||
            !this.getFieldValue(fields.email) ||
            !this.getFieldValue(fields.firstName) ||
            !this.getFieldValue(fields.familyName)
        );
    }

    get emailHelpText() {
        // Displays under the email Input as help text
        return this.hasEmailError
            ? 'This email is already in use'
            : 'Use an active email';
    }

    get emailHelpType() {
        // If the email has an error, use the 'error' help text
        return this.hasEmailError ? HelpTypes.error : HelpTypes.hint;
    }

    get passwordConfirmHelpText() {
        // If passwords do not match, set appropriate text under password Input
        return this.hasPasswordConfirmError ? 'Passwords do not match' : '';
    }

    get passwordConfirmHelpType() {
        return HelpTypes.error;
    }

    getFieldValue = field => this.state.formFields[field];

    handleFormState = formState => {
        const mergedFormFields = {
            ...this.state.formFields,
            ...formState.values
        };
        this.setState({ formFields: mergedFormFields });
    };

    render() {
        const { classes, defaultUsername } = this.props;
        const {
            onCreateAccount,
            errorMessage,
            emailHelpText,
            emailHelpType,
            passwordConfirmHelpText,
            passwordConfirmHelpType,
            isIncompleteOrInvalid
        } = this; // Uses `getters` defined above
        const {
            email,
            firstName,
            familyName,
            password,
            confirmPassword
        } = fields;

        return (
            <div className={classes.root}>
                <Form
                    onSubmit={onCreateAccount}
                    onChange={this.handleFormState}
                >
                    <div className={classes.rewards}>
                        <span>An account gives you access to rewards!</span>
                    </div>
                    <Input
                        onChange={this.updateEmail}
                        selected
                        label={'Email'}
                        helpText={emailHelpText}
                        helpType={emailHelpType}
                        required={true}
                        autoComplete={'email'}
                        initialValue={defaultUsername}
                        field={email}
                    />
                    <Input
                        label={'First Name'}
                        required={true}
                        autoComplete={'given-name'}
                        field={firstName}
                    />
                    <Input
                        label={'Last Name'}
                        required={true}
                        autoComplete={'family-name'}
                        field={familyName}
                    />
                    <Input
                        label={'Password'}
                        type={'password'}
                        required={true}
                        placeholder={'Enter a password'}
                        helpText={
                            'Password must be at least 8 characters long and contain 3 or more of the following: Lowercase, Uppercase, Digits, or Special Characters. (ex. Password1)'
                        }
                        autoComplete={'new-password'}
                        field={password}
                    />
                    <Input
                        label={'Confirm Password'}
                        type={'password'}
                        required={true}
                        placeholder={'Enter the password again'}
                        helpText={passwordConfirmHelpText}
                        helpType={passwordConfirmHelpType}
                        field={confirmPassword}
                    />
                    <Checkbox
                        label={'Subscribe to news and updates'}
                        select={this.handleCheckboxChange}
                        initialState={this.state.subscribe}
                    />
                    <div className={classes.createAccountButton}>
                        <Button type="submit" disabled={isIncompleteOrInvalid}>
                            Create Account
                        </Button>
                    </div>
                    {errorMessage}
                </Form>
            </div>
        );
    }

    onCreateAccount = () => {
        const { getFieldValue } = this;
        if (!this.isIncompleteOrInvalid) {
            const newCustomer = {
                customer: {
                    firstname: getFieldValue(fields.firstName),
                    lastname: getFieldValue(fields.familyName),
                    email: getFieldValue(fields.email)
                },
                password: getFieldValue(fields.password)
            };
            this.props.createAccount(newCustomer);
        }
    };

    handleCheckboxChange = value => {
        this.setState({ subscribe: value });
    };

    checkEmail = debounce(async () => {
        const email = this.getFieldValue(fields.email);
        try {
            const body = {
                customerEmail: email,
                website_id: null
            };
            // endpoint returns a boolean, so we set our emailAvailable state to the response
            const response = await request(
                '/rest/V1/customers/isEmailAvailable',
                {
                    method: 'POST',
                    body: JSON.stringify(body)
                }
            );
            this.setState({ emailAvailable: response, checkingEmail: false });
        } catch (error) {
            console.warn('err: ', error);
        }
    }, 300);

    updateEmail = () => {
        this.setState({ checkingEmail: true });
        this.checkEmail();
    };
}

export default classify(defaultClasses)(CreateAccount);
