import React, { Fragment } from 'react';
import { func, shape, string } from 'prop-types';

import { useForgotPassword } from '@magento/peregrine/lib/talons/ForgotPassword/useForgotPassword';

import { mergeClasses } from '../../classify';
import ForgotPasswordForm from './ForgotPasswordForm';
import FormSubmissionSuccessful from './FormSubmissionSuccessful';

import forgotPasswordOperations from './forgotPassword.gql';

import defaultClasses from './forgotPassword.css';

const INSTRUCTIONS =
    'Please enter the email address associated with this account.';

const ForgotPassword = props => {
    const { initialValues, onClose, onCancel } = props;

    const talonProps = useForgotPassword({
        onClose,
        onCancel,
        ...forgotPasswordOperations
    });

    const {
        forgotPasswordEmail,
        handleContinue,
        handleFormSubmit,
        handleCancel,
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
            <h2 className={classes.title}>Recover Password</h2>
            <p className={classes.instructions}>{INSTRUCTIONS}</p>
            <ForgotPasswordForm
                initialValues={initialValues}
                isResettingPassword={isResettingPassword}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
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
    onClose: func,
    onCancel: func
};

ForgotPassword.defaultProps = {
    onCancel: () => {},
    onClose: () => {}
};
