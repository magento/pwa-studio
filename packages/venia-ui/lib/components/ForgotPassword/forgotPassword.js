import React, { Fragment, useCallback } from 'react';
import { bool, func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import ForgotPasswordForm from './ForgotPasswordForm';
import FormSubmissionSuccessful from './FormSubmissionSuccessful';
import defaultClasses from './forgotPassword.css';

const INSTRUCTIONS = 'Enter your email below to receive a password reset link.';

const ForgotPassword = props => {
    const {
        completePasswordReset,
        email,
        initialValues,
        isInProgress,
        resetPassword,
        onClose
    } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleFormSubmit = useCallback(
        ({ email }) => {
            resetPassword({ email });
        },
        [resetPassword]
    );

    const handleContinue = useCallback(() => {
        completePasswordReset({ email });
        onClose();
    }, [completePasswordReset, email, onClose]);

    const children = isInProgress ? (
        <FormSubmissionSuccessful email={email} onContinue={handleContinue} />
    ) : (
        <Fragment>
            <p className={classes.instructions}>{INSTRUCTIONS}</p>
            <ForgotPasswordForm
                initialValues={initialValues}
                onSubmit={handleFormSubmit}
            />
        </Fragment>
    );

    return <div className={classes.root}>{children}</div>;
};

export default ForgotPassword;

ForgotPassword.propTypes = {
    classes: shape({
        instructions: string,
        root: string
    }),
    completePasswordReset: func.isRequired,
    email: string,
    initialValues: shape({
        email: string
    }),
    isInProgress: bool,
    onClose: func.isRequired,
    resetPassword: func.isRequired
};
