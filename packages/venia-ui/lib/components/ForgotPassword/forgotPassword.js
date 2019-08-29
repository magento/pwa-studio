import React, { Fragment, useCallback, useState } from 'react';
import { bool, func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import ForgotPasswordForm from './ForgotPasswordForm';
import FormSubmissionSuccessful from './FormSubmissionSuccessful';
import defaultClasses from './forgotPassword.css';

const INSTRUCTIONS = 'Enter your email below to receive a password reset link.';

const ForgotPassword = props => {
    const {
        initialValues,
        isResettingPassword,
        resetPassword,
        onClose
    } = props;

    const [inProgress, setInProgress] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState(null);

    const classes = mergeClasses(defaultClasses, props.classes);

    const handleFormSubmit = useCallback(
        async ({ email }) => {
            setInProgress(true);
            setForgotPasswordEmail(email);
            await resetPassword({ email });
        },
        [resetPassword]
    );

    const handleContinue = useCallback(() => {
        setInProgress(false);
        onClose();
    }, [onClose]);

    const children = inProgress ? (
        <FormSubmissionSuccessful
            email={forgotPasswordEmail}
            onContinue={handleContinue}
        />
    ) : (
        <Fragment>
            <p className={classes.instructions}>{INSTRUCTIONS}</p>
            <ForgotPasswordForm
                initialValues={initialValues}
                onSubmit={handleFormSubmit}
                isResettingPassword={isResettingPassword}
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
    email: string,
    initialValues: shape({
        email: string
    }),
    isResettingPassword: bool,
    onClose: func.isRequired,
    resetPassword: func.isRequired
};
