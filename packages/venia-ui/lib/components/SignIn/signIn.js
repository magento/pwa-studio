import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useSignIn } from '@magento/peregrine/lib/talons/SignIn/useSignIn';

import { mergeClasses } from '../../classify';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql';
import SIGN_IN_MUTATION from '../../queries/signIn.graphql';
import { mergeCartsMutation } from '../../queries/mergeCarts.gql';
import { isRequired } from '../../util/formValidators';
import Button from '../Button';
import Field from '../Field';
import LoadingIndicator from '../LoadingIndicator';
import TextInput from '../TextInput';
import defaultClasses from './signIn.css';
import { GET_CART_DETAILS_QUERY } from './signIn.gql';
import LinkButton from '../LinkButton';
import Password from '../Password';
import FormError from '../FormError/formError';

const SignIn = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { setDefaultUsername, showCreateAccount, showForgotPassword } = props;

    const { formatMessage } = useIntl();
    const talonProps = useSignIn({
        createCartMutation: CREATE_CART_MUTATION,
        customerQuery: GET_CUSTOMER_QUERY,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        signInMutation: SIGN_IN_MUTATION,
        mergeCartsMutation,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword
    });

    const {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy,
        setFormApi
    } = talonProps;

    if (isBusy) {
        return (
            <div className={classes.modal_active}>
                <LoadingIndicator>
                    <FormattedMessage
                        id={'Signing In'}
                        defaultMessage={'Signing In'}
                    />
                </LoadingIndicator>
            </div>
        );
    }

    const forgotPasswordClasses = {
        root: classes.forgotPasswordButton
    };

    return (
        <div className={classes.root}>
            <h2 className={classes.title}>
                <FormattedMessage
                    id={'Sign-in to Your Account'}
                    defaultMessage={'Sign-in to Your Account'}
                />
            </h2>
            <FormError errors={Array.from(errors.values())} />
            <Form
                getApi={setFormApi}
                className={classes.form}
                onSubmit={handleSubmit}
            >
                <Field
                    label={formatMessage({
                        id: 'Email address',
                        defaultMessage: 'Email address'
                    })}
                >
                    <TextInput
                        autoComplete="email"
                        field="email"
                        validate={isRequired}
                    />
                </Field>
                <Password
                    fieldName="password"
                    label={formatMessage({
                        id: 'Password',
                        defaultMessage: 'Password'
                    })}
                    validate={isRequired}
                    autoComplete="current-password"
                    isToggleButtonHidden={false}
                />
                <div className={classes.forgotPasswordButtonContainer}>
                    <LinkButton
                        classes={forgotPasswordClasses}
                        type="button"
                        onClick={handleForgotPassword}
                    >
                        <FormattedMessage
                            id={'Forgot Password?'}
                            defaultMessage={'Forgot Password?'}
                        />
                    </LinkButton>
                </div>
                <div className={classes.buttonsContainer}>
                    <Button priority="high" type="submit">
                        <FormattedMessage
                            id={'Sign In'}
                            defaultMessage={'Sign In'}
                        />
                    </Button>
                    <Button
                        priority="normal"
                        type="button"
                        onClick={handleCreateAccount}
                    >
                        <FormattedMessage
                            id={'Create an Account'}
                            defaultMessage={'Create an Account'}
                        />
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default SignIn;
SignIn.propTypes = {
    classes: shape({
        buttonsContainer: string,
        form: string,
        forgotPasswordButton: string,
        forgotPasswordButtonContainer: string,
        root: string,
        title: string
    }),
    setDefaultUsername: func,
    showCreateAccount: func,
    showForgotPassword: func
};
SignIn.defaultProps = {
    setDefaultUsername: () => {},
    showCreateAccount: () => {},
    showForgotPassword: () => {}
};
