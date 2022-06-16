import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useSignIn } from '@magento/peregrine/lib/talons/SignIn/useSignIn';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from './signIn.module.css';
import { GET_CART_DETAILS_QUERY } from '@magento/venia-concept/src/talons/SignIn/signIn.gql.js';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import Password from '@magento/venia-ui/lib/components/Password';
import FormError from '@magento/venia-ui/lib/components/FormError/formError';

const SignIn = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { setDefaultUsername, showCreateAccount, showForgotPassword } = props;

    const { formatMessage } = useIntl();
    const talonProps = useSignIn({
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword
    });

    const { errors, handleCreateAccount, handleForgotPassword, handleSubmit, isBusy, setFormApi } = talonProps;

    if (isBusy) {
        return (
            <div className={classes.modal_active}>
                <LoadingIndicator>
                    <FormattedMessage id={'signIn.loadingText'} defaultMessage={'Signing In'} />
                </LoadingIndicator>
            </div>
        );
    }

    const forgotPasswordClasses = {
        root: classes.forgotPasswordButton
    };

    return (
        <div className={classes.root}>
            <span className={classes.title}>
                <FormattedMessage id={'signIn.titleText'} defaultMessage={'Sign-in to Your Account'} />
            </span>
            <FormError errors={Array.from(errors.values())} />
            <Form getApi={setFormApi} className={classes.form} onSubmit={handleSubmit}>
                <Field
                    label={formatMessage({
                        id: 'signIn.emailAddressText',
                        defaultMessage: 'Email address'
                    })}
                >
                    <TextInput autoComplete="email" field="email" validate={isRequired} />
                </Field>
                <Password
                    fieldName="password"
                    label={formatMessage({
                        id: 'signIn.passwordText',
                        defaultMessage: 'Password'
                    })}
                    validate={isRequired}
                    autoComplete="current-password"
                    isToggleButtonHidden={false}
                />
                <div className={classes.forgotPasswordButtonContainer}>
                    <LinkButton classes={forgotPasswordClasses} type="button" onClick={handleForgotPassword}>
                        <FormattedMessage id={'signIn.forgotPasswordText'} defaultMessage={'Forgot Password?'} />
                    </LinkButton>
                </div>
                <div className={classes.buttonsContainer}>
                    <Button priority="high" type="submit">
                        <FormattedMessage id={'signIn.signInText'} defaultMessage={'Sign In'} />
                    </Button>
                    <Button priority="normal" type="button" onClick={handleCreateAccount}>
                        <FormattedMessage id={'signIn.createAccountText'} defaultMessage={'Create an Account'} />
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
