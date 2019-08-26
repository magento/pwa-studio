import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Redirect } from '@magento/venia-drivers';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Field from '../Field';
import TextInput from '../TextInput';
import combine from '../../util/combineValidators';
import {
    validateEmail,
    isRequired,
    validatePassword,
    validateConfirmPassword,
    hasLengthAtLeast
} from '../../util/formValidators';
import defaultClasses from './createAccount.css';

const LEAD =
    'Check out faster, use multiple addresses, track orders and more by creating an account!';

const CreateAccount = props => {
    const { hasError, initialValues = {}, isSignedIn, onSubmit } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const sanitizedInitialValues = useMemo(() => {
        const { email, firstName, lastName, ...rest } = initialValues;

        return {
            customer: { email, firstname: firstName, lastname: lastName },
            ...rest
        };
    }, [initialValues]);

    const errorMessage = hasError
        ? 'An error occurred. Please try again.'
        : null;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = useCallback(
        values => {
            setIsSubmitting(true);
            onSubmit(values);
        },
        [onSubmit]
    );

    useEffect(() => {
        if (hasError) {
            // Because `handleSubmit` can have side-effects that involve routing
            // and open modals only set submitting to false to avoid mem leaks.
            setIsSubmitting(false);
        }
    }, [hasError]);

    if (isSignedIn) {
        return <Redirect to="/" />;
    }

    return (
        <Form
            className={classes.root}
            initialValues={sanitizedInitialValues}
            onSubmit={handleSubmit}
        >
            <p className={classes.lead}>{LEAD}</p>
            <Field label="First Name" required={true}>
                <TextInput
                    field="customer.firstname"
                    autoComplete="given-name"
                    validate={isRequired}
                    validateOnBlur
                />
            </Field>
            <Field label="Last Name" required={true}>
                <TextInput
                    field="customer.lastname"
                    autoComplete="family-name"
                    validate={isRequired}
                    validateOnBlur
                />
            </Field>
            <Field label="Email" required={true}>
                <TextInput
                    field="customer.email"
                    autoComplete="email"
                    validate={combine([isRequired, validateEmail])}
                    validateOnBlur
                />
            </Field>
            <Field label="Password" required={true}>
                <TextInput
                    field="password"
                    type="password"
                    autoComplete="new-password"
                    validate={combine([
                        isRequired,
                        [hasLengthAtLeast, 8],
                        validatePassword
                    ])}
                    validateOnBlur
                />
            </Field>
            <Field label="Confirm Password" required={true}>
                <TextInput
                    field="confirm"
                    type="password"
                    validate={combine([isRequired, validateConfirmPassword])}
                    validateOnBlur
                />
            </Field>
            <div className={classes.subscribe}>
                <Checkbox
                    field="subscribe"
                    label="Subscribe to news and updates"
                />
            </div>
            <div className={classes.error}>{errorMessage}</div>
            <div className={classes.actions}>
                <Button disabled={isSubmitting} type="submit" priority="high">
                    {'Submit'}
                </Button>
            </div>
        </Form>
    );
};

CreateAccount.propTypes = {
    classes: shape({
        actions: string,
        error: string,
        lead: string,
        root: string,
        subscribe: string
    }),
    onSubmit: func.isRequired,
    error: shape({
        message: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    })
};

export default CreateAccount;
