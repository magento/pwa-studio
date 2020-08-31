import React from 'react';
import { Form } from 'informed';
import { func, shape, string, bool } from 'prop-types';
import { Redirect } from '@magento/venia-drivers';
import { useCreateAccount } from '@magento/peregrine/lib/talons/CreateAccount/useCreateAccount';

import { mergeClasses } from '../../classify';
import CREATE_ACCOUNT_MUTATION from '../../queries/createAccount.graphql';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql';
import SIGN_IN_MUTATION from '../../queries/signIn.graphql';
import { mergeCartsMutation } from '../../queries/mergeCarts.gql';
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
import defaultClasses from './createAccount.css';
import FormError from '../FormError';
import Password from '../Password';

const CreateAccount = props => {
    const talonProps = useCreateAccount({
        queries: {
            customerQuery: GET_CUSTOMER_QUERY,
            getCartDetailsQuery: GET_CART_DETAILS_QUERY
        },
        mutations: {
            createAccountMutation: CREATE_ACCOUNT_MUTATION,
            createCartMutation: CREATE_CART_MUTATION,
            signInMutation: SIGN_IN_MUTATION,
            mergeCartsMutation
        },
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        onCancel: props.onCancel
    });

    const {
        errors,
        handleCancel,
        handleSubmit,
        isDisabled,
        isSignedIn,
        initialValues
    } = talonProps;

    if (isSignedIn) {
        return <Redirect to="/" />;
    }

    const classes = mergeClasses(defaultClasses, props.classes);

    const cancelButton = props.isCancelButtonHidden ? null : (
        <Button
            className={classes.cancelButton}
            disabled={isDisabled}
            type="button"
            priority="normal"
            onClick={handleCancel}
        >
            {'Cancel'}
        </Button>
    );

    const submitButton = (
        <Button
            className={classes.submitButton}
            disabled={isDisabled}
            type="submit"
            priority="high"
        >
            {'Create an Account'}
        </Button>
    );

    return (
        <Form
            className={classes.root}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            <FormError errors={Array.from(errors.values())} />
            <Field label="First Name">
                <TextInput
                    field="customer.firstname"
                    autoComplete="given-name"
                    validate={isRequired}
                    validateOnBlur
                />
            </Field>
            <Field label="Last Name">
                <TextInput
                    field="customer.lastname"
                    autoComplete="family-name"
                    validate={isRequired}
                    validateOnBlur
                />
            </Field>
            <Field label="Email">
                <TextInput
                    field="customer.email"
                    autoComplete="email"
                    validate={isRequired}
                    validateOnBlur
                />
            </Field>
            <Password
                autoComplete="new-password"
                fieldName="password"
                isToggleButtonHidden={false}
                label="Password"
                validate={combine([
                    isRequired,
                    [hasLengthAtLeast, 8],
                    validatePassword
                ])}
                validateOnBlur
            />
            <div className={classes.subscribe}>
                <Checkbox
                    field="subscribe"
                    label="Subscribe to news and updates"
                />
            </div>
            <div className={classes.actions}>
                {cancelButton}
                {submitButton}
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
    onSubmit: func.isRequired,
    onCancel: func
};

CreateAccount.defaultProps = {
    onCancel: () => {},
    isCancelButtonHidden: true
};

export default CreateAccount;
