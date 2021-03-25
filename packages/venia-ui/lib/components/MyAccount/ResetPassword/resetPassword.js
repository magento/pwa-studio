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
import { StoreTitle } from '../../Head';
import Password from '../../Password';
import TextInput from '../../TextInput';
import defaultClasses from './resetPassword.css';
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
        handleSubmit
    } = talonProps;
    const PAGE_TITLE = formatMessage({
        id: 'resetPassword.pageTitleText',
        defaultMessage: 'Reset Password'
    });
    const tokenMissing = (
        <div className={classes.invalidTokenContainer}>
            <div className={classes.invalidToken}>
                <FormattedMessage
                    id={'resetPassword.invalidTokenMessage'}
                    defaultMessage={
                        'Uh oh, something went wrong. Check the link or try again.'
                    }
                />
            </div>
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
        <div className={classes.successMessageContainer}>
            <div className={classes.successMessage}>
                <FormattedMessage
                    id={'resetPassword.successMessage'}
                    defaultMessage={
                        'Your new password has been saved. Please use this password to sign into your Account.'
                    }
                />
            </div>
        </div>
    ) : (
        <Form className={classes.container} onSubmit={handleSubmit}>
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
                classes={{
                    root: classes.password
                }}
                label={formatMessage({
                    id: 'resetPassword.newPasswordText',
                    defaultMessage: 'New Password'
                })}
                fieldName={'newPassword'}
                isToggleButtonHidden={false}
            />
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
            <FormErrors
                classes={{
                    root: classes.errorMessage
                }}
                errors={formErrors}
            />
        </Form>
    );

    return (
        <div className={classes.root}>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <h1 className={classes.heading}>{PAGE_TITLE}</h1>
            {token ? recoverPassword : tokenMissing}
        </div>
    );
};

export default ResetPassword;

ResetPassword.propTypes = {
    classes: shape({
        container: string,
        description: string,
        errorMessage: string,
        heading: string,
        invalidToken: string,
        invalidTokenContainer: string,
        password: string,
        root: string,
        submitButton: string,
        successMessage: string,
        successMessageContainer: string
    })
};
