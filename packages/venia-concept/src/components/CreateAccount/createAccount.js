import React, { Component } from 'react';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';

import classify from 'src/classify';
import Button from 'src/components/Button';
import ErrorDisplay from 'src/components/ErrorDisplay';
import Field from 'src/components/Field';
import TextInput from 'src/components/TextInput';
import { asyncValidators, validators } from './validators';
import defaultClasses from './createAccount.css';

class CreateAccount extends Component {
    static propTypes = {
        classes: shape({
            error: string,
            root: string
        }),
        createAccountError: shape({
            message: string
        }),
        initialValues: shape({
            email: string,
            firstName: string,
            lastName: string
        }),
        onSubmit: func
    };

    static defaultProps = {
        initialValues: {}
    };

    get initialValues() {
        const { initialValues } = this.props;
        const { email, firstName, lastName, ...rest } = initialValues;

        return {
            customer: { email, firstname: firstName, lastname: lastName },
            ...rest
        };
    }

    handleSubmit = values => {
        const { onSubmit } = this.props;

        if (typeof onSubmit === 'function') {
            onSubmit(values);
        }
    };

    render() {
        const { handleSubmit, initialValues, props } = this;
        const { classes, createAccountError } = props;

        return (
            <Form
                className={classes.root}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <h3 className={classes.lead}>
                    {'An account gives you access to rewards!'}
                </h3>
                <Field label="Email">
                    <TextInput
                        field="customer.email"
                        autoComplete="email"
                        validate={validators.get('email')}
                        asyncValidate={asyncValidators.get('email')}
                        validateOnBlur
                        asyncValidateOnBlur
                    />
                </Field>
                <Field label="First Name">
                    <TextInput
                        field="customer.firstname"
                        autoComplete="given-name"
                        validate={validators.get('firstName')}
                        validateOnBlur
                    />
                </Field>
                <Field label="Last Name">
                    <TextInput
                        field="customer.lastname"
                        autoComplete="family-name"
                        validate={validators.get('lastName')}
                        validateOnBlur
                    />
                </Field>
                <Field label="Password">
                    <TextInput
                        field="password"
                        type="password"
                        autoComplete="new-password"
                        validate={validators.get('password')}
                        validateOnBlur
                    />
                </Field>
                <Field label="Confirm Password">
                    <TextInput
                        field="confirm"
                        type="password"
                        validate={validators.get('confirm')}
                        validateOnBlur
                    />
                </Field>
                <ErrorDisplay error={createAccountError} />
                <div className={classes.actions}>
                    <Button type="submit" priority="high">
                        {'Submit'}
                    </Button>
                </div>
            </Form>
        );
    }
}

export default classify(defaultClasses)(CreateAccount);
