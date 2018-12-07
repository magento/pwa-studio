import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import ForgotPasswordForm from './ForgotPasswordForm';
import FormSubmissionSuccessful from './FormSubmissionSuccessful';
import defaultClasses from './forgotPassword.css';
import { resetPasswordRequest } from './api';

class ForgotPassword extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            instructions: PropTypes.string
        }),
        initialValues: PropTypes.shape({
            email: PropTypes.string
        }),
        onClose: PropTypes.func.isRequired
    };

    state = {
        submittedEmail: '',
        submitSucceeded: false
    };

    handleFormSubmit = async ({ email }) => {
        await resetPasswordRequest({ email });

        this.setState({
            submittedEmail: email,
            submitSucceeded: true
        });
    };

    handleContinue = () => {
        this.setState({
            submittedEmail: '',
            submitSucceeded: false
        });

        this.props.onClose();
    };

    render() {
        const { submitSucceeded, submittedEmail } = this.state;
        const { initialValues, classes } = this.props;

        if (submitSucceeded) {
            return (
                <FormSubmissionSuccessful
                    email={submittedEmail}
                    onContinue={this.handleContinue}
                />
            );
        }

        return (
            <Fragment>
                <p className={classes.instructions}>
                    Enter your email below to receive a password reset link
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
