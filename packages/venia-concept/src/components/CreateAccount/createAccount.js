import React, { Component } from 'react';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';

import classify from 'src/classify';
import Button from 'src/components/Button';
import Checkbox from 'src/components/Checkbox';
import Field from 'src/components/Field';
import TextInput from 'src/components/TextInput';
import { validators } from './validators';
import defaultClasses from './createAccount.css';

class CreateAccount extends Component {
    static propTypes = {
        classes: shape({
            actions: string,
            error: string,
            lead: string,
            root: string,
            subscribe: string
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

    get errorMessage() {
        const { createAccountError } = this.props;

        if (createAccountError) {
            const errorIsEmpty = Object.keys(createAccountError).length === 0;
            if (!errorIsEmpty) {
                return 'An error occurred. Please try again.';
            }
        }
    }

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
        const { errorMessage, handleSubmit, initialValues, props } = this;
        const { classes } = props;

        return (
            <Form
                className={classes.root}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <h3 className={classes.lead}>
                    {`Check out faster, use multiple addresses, track
                         orders and more by creating an account!`}
                </h3>
                <Field label="First Name" required={true}>
                    <TextInput
                        field="customer.firstname"
                        autoComplete="given-name"
                        validate={validators.get('firstName')}
                        validateOnBlur
                    />
                </Field>
                <Field label="Last Name" required={true}>
                    <TextInput
                        field="customer.lastname"
                        autoComplete="family-name"
                        validate={validators.get('lastName')}
                        validateOnBlur
                    />
                </Field>
                <Field label="Email" required={true}>
                    <TextInput
                        field="customer.email"
                        autoComplete="email"
                        validate={validators.get('email')}
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
                <div className={classes.subscribe}>
                    <Checkbox
                        field="subscribe"
                        label="Subscribe to news and updates"
                    />
                </div>
                <div className={classes.error}>{errorMessage}</div>
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
