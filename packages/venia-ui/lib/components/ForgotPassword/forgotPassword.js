import React, { Fragment } from 'react';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import ForgotPasswordForm from './ForgotPasswordForm';
import FormSubmissionSuccessful from './FormSubmissionSuccessful';
import defaultClasses from './forgotPassword.css';
import { useForgotPassword } from '@magento/peregrine/lib/talons/ForgotPassword/useForgotPassword';

const INSTRUCTIONS = 'Enter your email below to receive a password reset link.';

const ForgotPassword = props => {
    const { initialValues, onClose } = props;

    const talonProps = useForgotPassword({
        onClose
    });

    const {
        forgotPasswordEmail,
        handleContinue,
        handleFormSubmit,
        inProgress,
        isResettingPassword
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

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
    onClose: func.isRequired
};
