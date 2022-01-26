import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';

import { useForgotPassword } from '@magento/peregrine/lib/talons/ForgotPassword/useForgotPassword';

import FormErrors from '../FormError';
import { useStyle } from '../../classify';
import ForgotPasswordForm from './ForgotPasswordForm';
import FormSubmissionSuccessful from './FormSubmissionSuccessful';

import defaultClasses from './forgotPassword.module.css';

const ForgotPassword = props => {
    const { initialValues, onCancel } = props;

    const { formatMessage } = useIntl();
    const talonProps = useForgotPassword({
        onCancel
    });

    const {
        forgotPasswordEmail,
        formErrors,
        hasCompleted,
        formProps
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const INSTRUCTIONS = formatMessage({
        id: 'forgotPassword.instructions',
        defaultMessage:
            'Please enter the email address associated with this account.'
    });
    const children = hasCompleted ? (
        <FormSubmissionSuccessful email={forgotPasswordEmail} />
    ) : (
        <Fragment>
            <h2 className={classes.title}>
                <FormattedMessage
                    id={'forgotPassword.recoverPasswordText'}
                    defaultMessage={'Recover Password'}
                />
            </h2>
            <p className={classes.instructions}>{INSTRUCTIONS}</p>
            <ForgotPasswordForm initialValues={initialValues} {...formProps} />
            <FormErrors errors={formErrors} />
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
    initialValues: shape({
        email: string
    }),
    onCancel: func
};

ForgotPassword.defaultProps = {
    onCancel: () => {}
};
