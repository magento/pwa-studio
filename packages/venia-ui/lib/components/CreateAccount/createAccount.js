import React from 'react';
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
import { useCreateAccount } from '@magento/peregrine/lib/talons/CreateAccount/useCreateAccount';
import CREATE_ACCOUNT_MUTATION from '../../queries/createAccount.graphql';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import SIGN_IN_MUTATION from '../../queries/signIn.graphql';
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql';

const LEAD =
    'Check out faster, use multiple addresses, track orders and more by creating an account!';

const CreateAccount = props => {
    const talonProps = useCreateAccount({
        createAccountQuery: CREATE_ACCOUNT_MUTATION,
        createCartMutation: CREATE_CART_MUTATION,
        customerQuery: GET_CUSTOMER_QUERY,
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        signInMutation: SIGN_IN_MUTATION
    });

    const {
        errors,
        handleSubmit,
        isDisabled,
        isSignedIn,
        initialValues
    } = talonProps;

    // Map over any errors we get and display an appropriate error.
    const errorMessage = errors.length
        ? errors
              .map(({ message }) => message)
              .reduce((acc, msg) => msg + '\n' + acc, '')
        : null;

    if (isSignedIn) {
        return <Redirect to="/" />;
    }

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Form
            className={classes.root}
            initialValues={initialValues}
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
                <Button disabled={isDisabled} type="submit" priority="high">
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
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    onSubmit: func.isRequired
};

export default CreateAccount;
