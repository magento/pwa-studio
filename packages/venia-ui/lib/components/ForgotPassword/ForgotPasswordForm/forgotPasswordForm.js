import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { bool, func, shape, string } from 'prop-types';
import { Form } from 'informed';

import { useStyle } from '../../../classify';
import { isRequired } from '../../../util/formValidators';
import Button from '../../Button';
import Field from '../../Field';
import GoogleReCaptcha from '../../GoogleReCaptcha';
import TextInput from '../../TextInput';
import defaultClasses from './forgotPasswordForm.module.css';

const ForgotPasswordForm = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        initialValues,
        isResettingPassword,
        onSubmit,
        onCancel,
        recaptchaWidgetProps
    } = props;

    const { formatMessage } = useIntl();

    return (
        <Form
            className={classes.root}
            initialValues={initialValues}
            onSubmit={onSubmit}
            data-cy="forgotPasswordForm-root"
        >
            <Field
                label={formatMessage({
                    id: 'forgotPasswordForm.emailAddressText',
                    defaultMessage: 'Email address'
                })}
            >
                <TextInput
                    autoComplete="email"
                    field="email"
                    validate={isRequired}
                    data-cy="email"
                />
            </Field>
            <GoogleReCaptcha {...recaptchaWidgetProps} />
            <div className={classes.buttonContainer}>
                <Button
                    className={classes.cancelButton}
                    disabled={isResettingPassword}
                    type="button"
                    priority="low"
                    onClick={onCancel}
                >
                    <FormattedMessage
                        id={'forgotPasswordForm.cancelButtonText'}
                        defaultMessage={'Cancel'}
                    />
                </Button>
                <Button
                    className={classes.submitButton}
                    disabled={isResettingPassword}
                    type="submit"
                    priority="high"
                    data-cy="forgotPasswordForm-submitButton"
                >
                    <FormattedMessage
                        id={'forgotPasswordForm.submitButtonText'}
                        defaultMessage={'Submit'}
                    />
                </Button>
            </div>
        </Form>
    );
};

ForgotPasswordForm.propTypes = {
    classes: shape({
        form: string,
        buttonContainer: string
    }),
    initialValues: shape({
        email: string
    }),
    isResettingPassword: bool,
    onCancel: func.isRequired,
    onSubmit: func.isRequired
};

ForgotPasswordForm.defaultProps = {
    initialValues: {},
    isResettingPassword: false
};

export default ForgotPasswordForm;
