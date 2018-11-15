import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import ForgotPasswordForm from './ForgotPasswordForm';
import FormSubmissionSuccessful from './FormSubmissionSuccessful';
import defaultClasses from './forgotPassword.css';
import { resetPasswordRequest } from './api';

class ForgotPassword extends Component {
    static propTypes = {
        classes: PropTypes.shape({}),
        initialValues: PropTypes.shape({}),
        onClose: PropTypes.func
    };

    state = {
        email: '',
        submitSucceeded: false
    };

    handleFormSubmit = async ({ email }) => {
        await resetPasswordRequest({ email });

        this.setState({
            email,
            submitSucceeded: true
        });
    };

    handleContinue = () => {
        this.setState({
            email: '',
            submitSucceeded: false
        });

        this.props.onClose();
    };

    render() {
        const { submitSucceeded, email } = this.state;
        const { initialValues, classes } = this.props;

        if (submitSucceeded) {
            return (
                <FormSubmissionSuccessful
                    email={email}
                    onContinue={this.handleContinue}
                />
            );
        }

        return (
            <Fragment>
                <p className={classes.instructions}>
                    Enter you email below to receive a password reset link
                </p>
                <ForgotPasswordForm
                    initialValues={initialValues}
                    onSubmit={this.handleFormSubmit}
                />
            </Fragment>
        );
    }
}

export default classify(defaultClasses)(ForgotPassword);
