import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, shape, string } from 'prop-types';
import { useToasts } from '@magento/peregrine';
import { useCreateAccount } from '@magento/peregrine/lib/talons/CheckoutPage/OrderConfirmationPage/useCreateAccount';

import combine from '../../../util/combineValidators';
import { useStyle } from '../../../classify';
import {
    hasLengthAtLeast,
    isRequired,
    validatePassword
} from '../../../util/formValidators';

import Button from '../../Button';
import Checkbox from '../../Checkbox';
import Field from '../../Field';
import FormError from '../../FormError';
import TextInput from '../../TextInput';
import Password from '../../Password';
import GoogleReCaptcha from '../../GoogleReCaptcha';

import defaultClasses from './createAccount.module.css';

const CreateAccount = props => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const [, { addToast }] = useToasts();

    const onSubmit = useCallback(() => {
        // TODO: Redirect to account/order page when implemented.
        const { scrollTo } = globalThis;

        if (typeof scrollTo === 'function') {
            scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
        }

        addToast({
            type: 'info',
            message: formatMessage({
                id: 'checkoutPage.accountSuccessfullyCreated',
                defaultMessage: 'Account successfully created.'
            }),
            timeout: 5000
        });
    }, [addToast, formatMessage]);

    const talonProps = useCreateAccount({
        initialValues: {
            email: props.email,
            firstName: props.firstname,
            lastName: props.lastname
        },
        onSubmit
    });

    const {
        errors,
        handleSubmit,
        isDisabled,
        initialValues,
        recaptchaWidgetProps,
        minimumPasswordLength
    } = talonProps;

    return (
        <div className={classes.root}>
            <h2>
                <FormattedMessage
                    id={'checkoutPage.quickCheckout'}
                    defaultMessage={'Quick Checkout When You Return'}
                />
            </h2>
            <p>
                <FormattedMessage
                    id={'checkoutPage.setAPasswordAndSave'}
                    defaultMessage={
                        'Set a password and save your information for next time in one easy step!'
                    }
                />
            </p>
            <FormError errors={Array.from(errors.values())} />
            <Form
                className={classes.form}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <Field
                    label={formatMessage({
                        id: 'global.firstName',
                        defaultMessage: 'First Name'
                    })}
                >
                    <TextInput
                        field="customer.firstname"
                        autoComplete="given-name"
                        aria-label={formatMessage({
                            id: 'global.firstNameRequired',
                            defaultMessage: 'First Name Required'
                        })}
                        data-cy="OrderConfirmationPage-CreateAccount-firstName"
                        validate={isRequired}
                        validateOnBlur
                    />
                </Field>
                <Field
                    label={formatMessage({
                        id: 'global.lastName',
                        defaultMessage: 'Last Name'
                    })}
                >
                    <TextInput
                        field="customer.lastname"
                        autoComplete="family-name"
                        aria-label={formatMessage({
                            id: 'global.lastNameRequired',
                            defaultMessage: 'Last Name Required'
                        })}
                        data-cy="OrderConfirmationPage-CreateAccount-lastName"
                        validate={isRequired}
                        validateOnBlur
                    />
                </Field>
                <Field
                    label={formatMessage({
                        id: 'global.email',
                        defaultMessage: 'Email'
                    })}
                >
                    <TextInput
                        field="customer.email"
                        autoComplete="email"
                        aria-label={formatMessage({
                            id: 'global.emailRequired',
                            defaultMessage: 'Email Required'
                        })}
                        data-cy="OrderConfirmationPage-CreateAccount-email"
                        validate={isRequired}
                        validateOnBlur
                    />
                </Field>
                <Password
                    label={formatMessage({
                        id: 'global.password',
                        defaultMessage: 'Password'
                    })}
                    fieldName="password"
                    isToggleButtonHidden={false}
                    autoComplete="new-password"
                    data-cy="OrderConfirmationPage-CreateAccount-password"
                    validate={combine([
                        isRequired,
                        [hasLengthAtLeast, minimumPasswordLength],
                        validatePassword
                    ])}
                    validateOnBlur
                    aria-label={formatMessage({
                        id: 'global.passwordRequired',
                        defaultMessage: 'Password Required'
                    })}
                />
                <div className={classes.subscribe}>
                    <Checkbox
                        field="subscribe"
                        id="subscribe"
                        data-cy="OrderConfirmationPage-CreateAccount-subscribe"
                        label={formatMessage({
                            id: 'checkoutPage.subscribe',
                            defaultMessage: 'Subscribe to news and updates'
                        })}
                    />
                </div>
                <GoogleReCaptcha {...recaptchaWidgetProps} />
                <div className={classes.actions}>
                    <Button
                        disabled={isDisabled}
                        type="submit"
                        className={classes.create_account_button}
                        data-cy="OrderConfirmationPage-CreateAccount-createAccountButton"
                    >
                        <FormattedMessage
                            id={'checkoutPage.createAccount'}
                            defaultMessage={'Create Account'}
                        />
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CreateAccount;

CreateAccount.propTypes = {
    classes: shape({
        actions: string,
        create_account_button: string,
        form: string,
        root: string,
        subscribe: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    onSubmit: func
};
