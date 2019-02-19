import React, { Component } from 'react';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';

import classify from 'src/classify';
import Button from 'src/components/Button';
import ErrorDisplay from 'src/components/ErrorDisplay';
import Input from 'src/components/Input';
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
            <Form initialValues={initialValues} onSubmit={handleSubmit}>
                <h3 className={classes.lead}>
                    {'An account gives you access to rewards!'}
                </h3>
                <Input
                    label="Email"
                    required={true}
                    field="customer.email"
                    autoComplete="email"
                    validate={validators.get('email')}
                    asyncValidate={asyncValidators.get('email')}
                    validateOnBlur
                    asyncValidateOnBlur
                />
                <Input
                    label="First Name"
                    required={true}
                    field="customer.firstname"
                    autoComplete="given-name"
                    validate={validators.get('firstName')}
                    validateOnBlur
                />
                <Input
                    label="Last Name"
                    required={true}
                    field="customer.lastname"
                    autoComplete="family-name"
                    validate={validators.get('lastName')}
                    validateOnBlur
                />
                <Input
                    label="Password"
                    required={true}
                    field="password"
                    type="password"
                    autoComplete="new-password"
                    validate={validators.get('password')}
                    validateOnBlur
                />
                <Input
                    label="Confirm Password"
                    required={true}
                    field="confirm"
                    type="password"
                    validate={validators.get('confirm')}
                    validateOnBlur
                />
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
