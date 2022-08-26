import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, shape, string, bool } from 'prop-types';
import { useCreateAccount } from '@magento/peregrine/lib/talons/CreateAccount/useCreateAccount';

import { useStyle } from '../../classify';
import combine from '../../util/combineValidators';
import {
    hasLengthAtLeast,
    isRequired,
    validatePassword
} from '../../util/formValidators';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Field from '../Field';
import TextInput from '../TextInput';
import defaultClasses from './createAccount.module.css';
import FormError from '../FormError';
import Password from '../Password';
import GoogleRecaptcha from '../GoogleReCaptcha';

const CreateAccount = props => {
    const talonProps = useCreateAccount({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        onCancel: props.onCancel
    });

    const {
        errors,
        handleCancel,
        handleSubmit,
        isDisabled,
        initialValues,
        recaptchaWidgetProps
    } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const cancelButton = props.isCancelButtonHidden ? null : (
        <Button
            data-cy="CreateAccount-cancelButton"
            className={classes.cancelButton}
            disabled={isDisabled}
            type="button"
            priority="low"
            onClick={handleCancel}
        >
            <FormattedMessage
                id={'createAccount.cancelText'}
                defaultMessage={'Cancel'}
            />
        </Button>
    );

    const submitButton = (
        <Button
            className={classes.submitButton}
            disabled={isDisabled}
            type="submit"
            priority="high"
            data-cy="CreateAccount-submitButton"
        >
            <FormattedMessage
                id={'createAccount.createAccountText'}
                defaultMessage={'Create an Account'}
            />
        </Button>
    );

    return (
        <Form
            data-cy="CreateAccount-form"
            className={classes.root}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            <h2 data-cy="CreateAccount-title" className={classes.title}>
                <FormattedMessage
                    id={'createAccount.createAccountText'}
                    defaultMessage={'Create an Account'}
                />
            </h2>
            <FormError errors={Array.from(errors.values())} />
            <Field
                id="firstName"
                label={formatMessage({
                    id: 'createAccount.firstNameText',
                    defaultMessage: 'First Name'
                })}
            >
                <TextInput
                    id="firstName"
                    field="customer.firstname"
                    autoComplete="given-name"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-firstname"
                />
            </Field>
            <Field
                id="lastName"
                label={formatMessage({
                    id: 'createAccount.lastNameText',
                    defaultMessage: 'Last Name'
                })}
            >
                <TextInput
                    id="lastName"
                    field="customer.lastname"
                    autoComplete="family-name"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-lastname"
                />
            </Field>
            <Field
                id="Email"
                label={formatMessage({
                    id: 'createAccount.emailText',
                    defaultMessage: 'Email'
                })}
            >
                <TextInput
                    id="Email"
                    field="customer.email"
                    autoComplete="email"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-email"
                />
            </Field>
            <Password
                id="Password"
                autoComplete="new-password"
                fieldName="password"
                isToggleButtonHidden={false}
                label={formatMessage({
                    id: 'createAccount.passwordText',
                    defaultMessage: 'Password'
                })}
                validate={combine([
                    isRequired,
                    [hasLengthAtLeast, 8],
                    validatePassword
                ])}
                validateOnBlur
                mask={value => value && value.trim()}
                maskOnBlur={true}
                data-cy="password"
            />
            <div className={classes.subscribe}>
                <Checkbox
                    field="subscribe"
                    id="subscribe"
                    label={formatMessage({
                        id: 'createAccount.subscribeText',
                        defaultMessage: 'Subscribe to news and updates'
                    })}
                />
            </div>
            <GoogleRecaptcha {...recaptchaWidgetProps} />
            <div className={classes.actions}>
                {submitButton}
                {cancelButton}
            </div>
        </Form>
    );
};

CreateAccount.propTypes = {
    classes: shape({
        actions: string,
        lead: string,
        root: string,
        subscribe: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    isCancelButtonHidden: bool,
    onSubmit: func,
    onCancel: func
};

CreateAccount.defaultProps = {
    onCancel: () => {},
    isCancelButtonHidden: true
};

export default CreateAccount;
