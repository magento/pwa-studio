import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import defaultClasses from './signIn.css';
import classify from 'src/classify';
import { Form } from 'informed';
import ErrorDisplay from 'src/components/ErrorDisplay';

const fields = {
    username: 'username',
    password: 'password'
};

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

    constructor(props) {
        super(props);
        this.formState = {};
    }

    get errorMessage() {
        const { signInError } = this.props;
        return <ErrorDisplay error={signInError} />;
    }

    getFieldValue = field => get(this.formState, `values.${field}`, '');

    handleFormState = formState => {
        this.formState = formState;
    };

    render() {
        const { classes } = this.props;
        const { onSignIn, errorMessage } = this;
        const { username, password } = fields;

        return (
            <div className={classes.root}>
                <Form onSubmit={onSignIn} onChange={this.handleFormState}>
                    <Input
                        helpText={'example help text'}
                        label={'Username or Email'}
                        required
                        autoComplete={'username'}
                        field={username}
                    />
                    <Input
                        label={'Password'}
                        type={'password'}
                        helpText={'example help text'}
                        required
                        autoComplete={'current-password'}
                        field={password}
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
                    <Button onClick={this.showCreateAccountForm}>
                        {' '}
                        Create an Account{' '}
                    </Button>
                </div>
            </div>
        );
    }

    onSignIn = () => {
        const username = this.getFieldValue(fields.username);
        const password = this.getFieldValue(fields.password);
        this.props.signIn({ username, password });
    };

    showCreateAccountForm = () => {
        this.props.setDefaultUsername(this.getFieldValue(fields.username));
        this.props.showCreateAccountForm();
    };
}

export default classify(defaultClasses)(SignIn);
