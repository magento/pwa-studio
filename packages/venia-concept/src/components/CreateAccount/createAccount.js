import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import defaultClasses from './createAccount.css';
import classify from 'src/classify';
import Form from 'src/components/Form';
import { debounce } from 'underscore';
import { RestApi } from '@magento/peregrine';
import Icon from 'src/components/Icon';

const mockAccount = {
    customer: {
    id: 0,
    group_id: 0,
    default_billing: "string",
    default_shipping: "string",
    confirmation: "string",
    created_at: "2018-09-13T18:26:34.662Z",
    updated_at: "2018-09-13T18:26:34.662Z",
    created_in: "string",
    dob: "1/1/2010",
    email: "text12@example.com",
    firstname: "string",
    lastname: "string",
    middlename: "string",
    prefix: "string",
    suffix: "string",
    gender: 0,
    store_id: 0,
    taxvat: "string",
    website_id: 0,
    addresses: [
      {
        id: 0,
        customer_id: 0,
        region: {
          region_code: "string",
          region: "string",
          region_id: 0,
          extension_attributes: {}
        },
        region_id: 0,
        country_id: "US",
        street: [
          "string"
        ],
        company: "string",
        telephone: "string",
        fax: "string",
        postcode: "string",
        city: "string",
        firstname: "string",
        lastname: "string",
        middlename: "string",
        prefix: "string",
        suffix: "string",
        vat_id: "string",
        default_shipping: true,
        default_billing: true,
        extension_attributes: {},
        custom_attributes: [
          {
            attribute_code: "string",
            value: "string"
          }
        ]
      }
    ],
    disable_auto_group_change: 0,
    extension_attributes: {
      is_subscribed: true
    },
    custom_attributes: [
      {
        attribute_code: "string",
        value: "string"
      }
    ]
  },
  password: "passW0rd1",
  redirectUrl: "string"
}

const { request } = RestApi.Magento2;

class CreateAccount extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
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
        emailAvailable: false
    };

    get errorMessage() {
        const { classes, createAccountError } = this.props;
        const isErrorEmpty = Object.keys(createAccountError).length === 0;
        return !isErrorEmpty ? (
            <div className={classes.createAccountError}>
                <p> {createAccountError.message} </p>
            </div>
        ) : null;
    }

    get emailAvailable() {
        if (this.state.email) {
            if (!this.state.checkingEmail) {
                return this.state.emailAvailable ? (
                    <Icon name="check-circle" />
                ) : <Icon name="slash" />
            } else {
                return (
                    <div>
                        <span>Checking....</span>
                    </div>
                )
            }
        } else {
            return null;
        }
    }

    render() {
        const { classes } = this.props;
        const { onCreateAccount, errorMessage, emailAvailable} = this;
        return (
            <div className={classes.root}>
                <Form submitForm={onCreateAccount}>

                    <div className={classes.rewards}>
                        <span>An account gives you access to rewards!</span>
                    </div>

                    <Input
                        onChange={this.updateEmail}
                        label={'Email'}
                        helpText={'Use an active email address'}
                        required={true}
                    />

                    {emailAvailable}

                    <Input
                        onChange={this.updateName}
                        label={'Name'}
                    />

                    <Input
                        onChange={this.updatePassword}
                        errorText={
                            'Password must be at least 8 characters long'
                        }
                        errorVisible={this.passwordError()}
                        label={'Password'}
                        type={'password'}
                        required={true}
                        placeholder={'Enter a password'}
                    />

                    <Input
                        onChange={this.updatePasswordConfirm}
                        errorText={
                            'Passwords must match'
                        }
                        errorVisible={this.passwordConfirmError()}
                        label={'Confirm Password'}
                        type={'password'}
                        required={true}
                        placeholder={'Enter the password again'}
                    />
                <div className={classes.createAccountButton}>
                    <Button type="submit">Create Account</Button>
                </div>
                    {errorMessage}
                </Form>
            </div>
        );
    }

    passwordError() {
        return this.state.password.length < 8;
    }

    passwordConfirmError() {
        return this.state.password !== this.state.passwordConfirm;
    }

    onCreateAccount = () => {
        this.props.createAccount(mockAccount);
    };

     checkEmail = debounce(async (email) => {
        try {
            const body = {
                customerEmail: email,
                website_id: 0
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
