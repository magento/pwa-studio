import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import defaultClasses from './signIn.css';
import classify from 'src/classify';

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
        const { classes } = this.props;
        const { onSignIn, errorMessage, onCreateAccount } = this;
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
                            'Password must be at least 8 characters long'
                        }
                        errorVisible={this.passwordError()}
                        label={'Password'}
                        type={'password'}
                        helpText={'example help text'}
                    />

                    <Button type="submit">Sign In</Button>
                    {errorMessage}
                    <div className={classes.forgotPassword}>
                        <a href="/"> Forgot your username or password? </a>
                    </div>
                </form>
                <div className={classes.signInDivider} />
                <div className={classes.signInSection}>
                    <Button onClick={onCreateAccount}> Create Account </Button>
                </div>
            </div>
        );
    }

    passwordError() {
        return this.state.password.length < 8;
    }

    onSignIn = event => {
        event.preventDefault();
        const { username, password } = this.state;
        this.props.signIn({ username: username, password: password });
    };

    onCreateAccount = () => {
        this.props.createAccount(mockAccount);
        this.props.signIn({ username: mockAccount.customer.email, password: mockAccount.password });
        this.props.assignGuestCartToCustomer();
    };

    updatePassword = newPassword => {
        this.setState({ password: newPassword });
    };

    updateUsername = newUsername => {
        this.setState({ username: newUsername });
    };
}

export default classify(defaultClasses)(SignIn);
