import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import ForgotPasswordForm from './ForgotPasswordForm';
import FormSubmissionSuccessful from './FormSubmissionSuccessful';
import defaultClasses from './forgotPassword.css';

class ForgotPassword extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            instructions: PropTypes.string
        }),
        completePasswordReset: PropTypes.func.isRequired,
        email: PropTypes.string,
        initialValues: PropTypes.shape({
            email: PropTypes.string
        }),
        isInProgress: PropTypes.bool,
        onClose: PropTypes.func.isRequired,
        resetPassword: PropTypes.func.isRequired
    };

    handleFormSubmit = async ({ email }) => {
        this.props.resetPassword({ email });
    };

    handleContinue = () => {
        const { completePasswordReset, email, onClose } = this.props;

        completePasswordReset({ email });
        onClose();
    };

    render() {
        const { classes, email, initialValues, isInProgress } = this.props;

        if (isInProgress) {
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
