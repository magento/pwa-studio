import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';
import { Form } from 'informed';

import { useToasts } from '@magento/peregrine';
import { useResetPassword } from '@magento/peregrine/lib/talons/MyAccount/useResetPassword';

import { useStyle } from '../../../classify';
import { isRequired } from '../../../util/formValidators';
import Button from '../../Button';
import Field from '../../Field';
import FormErrors from '../../FormError';
import GoogleReCaptcha from '../../GoogleReCaptcha';
import { StoreTitle } from '../../Head';
import Password from '../../Password';
import TextInput from '../../TextInput';
import defaultClasses from './resetPassword.module.css';
import resetPasswordOperations from './resetPassword.gql';

const ResetPassword = props => {
    const { classes: propClasses } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);
    const talonProps = useResetPassword({ ...resetPasswordOperations });
    const {
        hasCompleted,
        loading,
        token,
        formErrors,
        handleSubmit,
        recaptchaWidgetProps
    } = talonProps;

    const tokenMissing = (
        <div className={classes.invalidToken}>
            <FormattedMessage
                id={'resetPassword.invalidTokenMessage'}
                defaultMessage={
                    'Uh oh, something went wrong. Check the link or try again.'
                }
            />
        </div>
    );

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasCompleted) {
            addToast({
                type: 'info',
                message: formatMessage({
                    id: 'resetPassword.savedPasswordText',
                    defaultMessage: 'Your new password has been saved.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, hasCompleted]);
    const recoverPassword = hasCompleted ? (
        <div className={classes.successMessage}>
            <FormattedMessage
                id={'resetPassword.successMessage'}
                defaultMessage={
                    'Your new password has been saved. Please use this password to sign into your Account.'
                }
            />
        </div>
    ) : (
        <Form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.description}>
                <FormattedMessage
                    id={'resetPassword.descriptionText'}
                    defaultMessage={
                        'Please enter your email address and new password.'
                    }
                />
            </div>
            <Field label={'Email address'}>
                <TextInput field={'email'} validate={isRequired} />
            </Field>
            <Password
                label={formatMessage({
                    id: 'resetPassword.newPasswordText',
                    defaultMessage: 'New Password'
                })}
                fieldName={'newPassword'}
                isToggleButtonHidden={false}
            />
            <GoogleReCaptcha {...recaptchaWidgetProps} />
            <div className={classes.buttonContainer}>
                <Button
                    className={classes.submitButton}
                    type="submit"
                    priority="high"
                    disabled={loading}
                >
                    <FormattedMessage
                        id="resetPassword.savePassword"
                        defaultMessage="Save Password"
                    />
                </Button>
            </div>
            <FormErrors errors={formErrors} />
        </Form>
    );

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'resetPassword.title',
                    defaultMessage: 'Reset Password'
                })}
            </StoreTitle>
            <h1 aria-live="polite" className={classes.header}>
                <FormattedMessage
                    id="resetPassword.header"
                    defaultMessage="Reset Password"
                />
            </h1>
            <div className={classes.contentContainer}>
                {token ? recoverPassword : tokenMissing}
            </div>
        </div>
    );
};

export default ResetPassword;

ResetPassword.propTypes = {
    classes: shape({
        root: string,
        header: string,
        contentContainer: string,
        form: string,
        description: string,
        invalidToken: string,
        buttonContainer: string,
        submitButton: string,
        successMessage: string
    })
};
