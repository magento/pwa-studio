import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Form } from 'informed';
import SignInFooter from './signInFooter';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import defaultClasses from './signIn.css';
import classify from 'src/classify';
import ErrorDisplay from 'src/components/ErrorDisplay';
import { fields } from './constants';

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
        signIn: PropTypes.func,
        setDefaultUsername: PropTypes.func,
        showCreateAccountForm: PropTypes.func
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
        const {
            classes,
            setDefaultUsername,
            showCreateAccountForm
        } = this.props;
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
                    <SignInFooter
                        classes={classes}
                        setDefaultUsername={setDefaultUsername}
                        showCreateAccountForm={showCreateAccountForm}
                    />
                </Form>
            </div>
        );
    }

    onSignIn = ({ username, password }) => {
        this.props.signIn({ username, password });
    };
}

export default classify(defaultClasses)(SignIn);
